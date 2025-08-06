import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SplitView from "../../../components/SplitView";

interface PageProps {
  params: { id: string };
}

export default async function StudentSingleView({ params }: PageProps) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!question) return notFound();

  return <SplitView question={question} />;
}
