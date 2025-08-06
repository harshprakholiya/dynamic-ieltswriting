// app/student/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SplitView from "../../../components/SplitView";

export default async function StudentSingleView({
  params,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: { id: any };
}) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!question) return notFound();

  return <SplitView question={question} />;
}
