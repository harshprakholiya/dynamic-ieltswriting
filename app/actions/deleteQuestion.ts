'use server';


import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';

export async function deleteQuestionAction(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error("Missing question ID");
  }

  const existing = await prisma.question.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Question not found");
  }

  await prisma.question.delete({
    where: { id },
  });

  revalidatePath('/teacher'); // update path as needed
}
