import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { Suspense } from "react";
import ExamEditor from "../../../../components/student/ExamEditor";

export default async function ExamPage({ params }: { params: { id: string } }) {
  const headersList = await headers(); // ✅ FIXED: await the headers call
  const url = headersList.get("x-next-url") || "";
  const searchParams = new URLSearchParams(url.split("?")[1] || "");
  const mode = searchParams.get("mode") === "hard" ? "hard" : "simple";

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      part1: true,
      part2: true,
    },
  });

  if (!exam) return notFound();

  return (
    <Suspense>
      <ExamEditor
        examId={exam.id}
        part1={exam.part1}
        part2={exam.part2}
        mode={mode}
      />
    </Suspense>
  );
}
