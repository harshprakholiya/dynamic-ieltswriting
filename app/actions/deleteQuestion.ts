'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';

export async function deleteQuestionAction(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error("Missing question ID");
  }

  const existing = await prisma.question.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Question not found");
  }

  // Check if this question is used in any Exam
  const examUsingPart1 = await prisma.exam.findFirst({ where: { part1Id: id } });
  const examUsingPart2 = await prisma.exam.findFirst({ where: { part2Id: id } });

  if (examUsingPart1 || examUsingPart2) {
    throw new Error("Cannot delete question — it is linked to an exam");
    // OR handle manually:
    // await prisma.exam.delete({ where: { id: examUsingPart1.id } });
    // or unlink if relation is optional
  }

  // Delete question if not linked
  await prisma.question.delete({ where: { id } });

  revalidatePath('/teacher'); // refresh page
}
