import { notFound } from 'next/navigation';

import { Suspense } from 'react';
import { prisma } from '../../../../lib/prisma';
import ExamEditor from '../../../../components/student/ExamEditor';


interface PageProps {
  params: { id: string };
  searchParams: { mode?: string };
}

export default async function ExamPage({ params, searchParams }: PageProps) {
  const mode = searchParams.mode === 'hard' ? 'hard' : 'simple';
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
