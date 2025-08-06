import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SplitView from "../../../components/SplitView";
import { type Metadata } from "next";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function StudentSingleView({ params }: PageProps) {
  const rawQuestion = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!rawQuestion) return notFound();

  const question = JSON.parse(JSON.stringify(rawQuestion)); // Ensure serializable

  return <SplitView question={question} />;
}
