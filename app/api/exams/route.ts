import { NextRequest, NextResponse } from "next/server";

import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const part1Text = formData.get("part1Text") as string;
    const part1Subtype = formData.get("part1Subtype") as string;
    const part2Text = formData.get("part2Text") as string;
    const part2Subtype = formData.get("part2Subtype") as string;

    const imageFile = formData.get("part1Image") as File | null;

    let imagePath: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${uuid()}-${imageFile.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    const part1 = await prisma.question.create({
      data: {
        type: "part1",
        subtype: part1Subtype,
        text: part1Text,
        image: imagePath,
      },
    });

    const part2 = await prisma.question.create({
      data: {
        type: "part2",
        subtype: part2Subtype,
        text: part2Text,
      },
    });

    await prisma.exam.create({
      data: {
        title,
        part1Id: part1.id,
        part2Id: part2.id,
      },
    });

    return NextResponse.json({ message: "Exam created" }, { status: 200 });
  } catch (error) {
    console.error("[Create Exam Error]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("id");

    if (!examId) {
      return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
    }

    // Fetch exam to get related questions
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { part1: true, part2: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Delete exam first (or last, doesn't matter with CASCADE off)
    await prisma.exam.delete({ where: { id: examId } });

    // Delete related questions manually if no cascade set
    await prisma.question.delete({ where: { id: exam.part1Id } });
    await prisma.question.delete({ where: { id: exam.part2Id } });

    return NextResponse.json({ message: "Exam deleted" }, { status: 200 });
  } catch (error) {
    console.error("[Delete Exam Error]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
