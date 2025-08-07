import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SplitView from "../../../components/SplitView";

export default async function StudentSingleView({
  params,
}: {
  params: { id: string };
}) {
  const rawQuestion = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!rawQuestion) return notFound();

  const question = JSON.parse(JSON.stringify(rawQuestion)); // to make it serializable

  return <SplitView question={question} />;
}
