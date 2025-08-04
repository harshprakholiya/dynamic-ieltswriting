import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // adjust path as needed
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type !== 'part1' && type !== 'part2') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { type },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const type = formData.get('type') as 'part1' | 'part2';
  const text = formData.get('text') as string;
  const file = formData.get('image') as File | null;

  let imagePath: string | null = null;

  if (type === 'part1' && file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuid()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    imagePath = `/uploads/${filename}`;
  }

  await prisma.question.create({
    data: {
      type,
      text,
      image: imagePath,
    },
  });

  return NextResponse.json({ message: 'Question added' });
}
