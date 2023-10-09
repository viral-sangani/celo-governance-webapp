import { formatAmount, toWei } from "@/utils/helper";
import { fetchBalances, fetchLockedSummary } from "@/utils/lock";
import { AccountSummary, Balance } from "@/utils/types/lock.type";
import { newKit } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface Props {}

enum States {
  None,
  Activating,
  Revoking,
  Locking,
  Unlocking,
}

export const defaultBalances = {
  celo: new BigNumber(0),
  cusd: new BigNumber(0),
  ceur: new BigNumber(0),
};

export const defaultLockedSummary: AccountSummary = {
  lockedGold: {
    total: new BigNumber(0),
    nonvoting: new BigNumber(0),
    requirement: new BigNumber(0),
  },
  pendingWithdrawals: [],
};

const Lock: React.FC<Props> = ({}) => {
  const { address } = useAccount();

  const kit = newKit("https://forno.celo.org");
  const [lockAmount, setLockAmount] = useState("");
  const [state, setState] = useState(States.None);
  const [total, setTotal] = useState<BigNumber>(new BigNumber(0));
  const [lockedPct, setLockedPct] = useState<string>("0");
  const [balances, setBalances] = useState<Balance>(defaultBalances);
  const [lockedSummary, setLockedSummary] = useState(defaultLockedSummary);

  useEffect(() => {
    const fetchData = async () => {
      const balanceRes = await fetchBalances(
        kit,
        address as string | undefined
      );
      console.log("balanceRes", balanceRes);

      const lockedSummaryRes = await fetchLockedSummary(
        kit,
        address as string | undefined
      );
      console.log("lockedSummaryRes", lockedSummaryRes);

      setBalances(balanceRes);
      if (lockedSummaryRes) {
        setLockedSummary(lockedSummaryRes);
        setTotal(lockedSummaryRes.lockedGold.total.plus(balanceRes.celo));
      }
    };
    if (address) {
      fetchData();
    }
  }, [address]);

  const lockGold = async () => {
    console.log("lockAmount", lockAmount);

    // lockCelo(kit, lockAmount);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-2">
          <main className="flex flex-col items-center justify-center w-full">
            <h1 className="text-2xl font-bold mb-10">Celo Governance</h1>
            <main className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center w-full space-y-4">
                <div className="md:grid md:grid-cols-4 md:gap-6 py-2">
                  <div className="md:col-span-1">
                    <h3 className="text-xl font-medium leading-6 text-black">
                      Lock CELO
                    </h3>
                  </div>
                  <div className="mt-2 md:mt-0 md:col-span-3">
                    <div className="flex flex-col space-y-4">
                      <div className="text-gray-400 text-sm">
                        currently has{" "}
                        <span className="font-medium text-black">
                          {formatAmount(lockedSummary.lockedGold.total, 2)}
                        </span>{" "}
                        out of{" "}
                        <span className="text-black">
                          {formatAmount(total, 2)}
                        </span>{" "}
                        ({parseFloat(lockedPct)}%) CELO locked for voting.
                      </div>
                      <div>
                        <span className="flex flex-col">
                          <div className="w-full md:w-96 md:mx-auto">
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                type="text"
                                value={lockAmount}
                                onChange={(e) => setLockAmount(e.target.value)}
                                className="appearance-none block px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-600 text-gray-300 w-full"
                                placeholder={"0"}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center">
                                <div className="flex items-center justify-center focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-4 border-transparent bg-transparent text-gray-300 sm:text-sm rounded-md">
                                  CELO
                                </div>
                              </div>
                            </div>
                            <div className="flex text-gray-400 text-xs mt-2">
                              {toWei(lockAmount || "0")} CELO (Wei)
                            </div>
                          </div>
                          {state === States.Locking ||
                          state === States.Unlocking ? (
                            <div className="flex items-center justify-center mt-3">
                              {/* <Loader
                                type="TailSpin"
                                color="white"
                                height="24px"
                                width="24px"
                              /> */}
                              <span>Loading</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex space-x-4 justify-center items-center">
                                {/* <button
                                  className="secondary-button"
                                  onClick={unlock}
                                >
                                  Unlock
                                </button> */}
                                <button
                                  className="secondary-button"
                                  onClick={() => {
                                    lockGold();
                                  }}
                                >
                                  Lock
                                </button>
                              </div>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </main>
        </div>
      </div>
    </>
  );
};

export default Lock;
