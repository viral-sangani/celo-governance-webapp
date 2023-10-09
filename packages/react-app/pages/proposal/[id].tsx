import { getProposal } from "@/utils/proposals";
import { Proposal } from "@/utils/types/proposal.type";

type Props = {
  proposal: Proposal;
};

function Proposal({ proposal }: Props) {
  return (
    <pre className="overflow-auto max-w-full">
      <code className="whitespace-pre-wrap">
        {JSON.stringify(proposal, null, 2)}
      </code>
    </pre>
  );
}

export default Proposal;

export async function getServerSideProps(context: any) {
  const id = context.params.id;
  const proposal = await getProposal(id);
  console.log("proposal", proposal);
  return {
    props: {
      proposal,
    },
  };
}
