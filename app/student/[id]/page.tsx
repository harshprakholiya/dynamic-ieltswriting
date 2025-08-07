import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SplitView from "../../../components/SplitView";

export default async function Page({ params }: { params: { id: string } }) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!question) return notFound();

  return <SplitView question={question} />;
}
