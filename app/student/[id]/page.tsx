import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import Editor from "../../../components/Editor";
import Image from "next/image";

import type { Metadata } from "next";
import ResizableSplit from "../../../components/SplitView";

// Metadata export (optional, can be dynamic if needed)
export const metadata: Metadata = {
  title: "IELTS Writing Question",
  description: "Write your answer in the editor",
};

// Page component with safe param resolution
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) return notFound();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <ResizableSplit
        left={<div className="w-full p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {question.type === "part1" ? "Task 1" : "Task 2"} Question
        </h2>
        <p className="mb-3">{question.text}</p>
        {question.image && (
          <Image
            src={question.image}
            alt="Task Image"
            width={400}
            height={300}
            className="rounded-md shadow-md"
          />
        )}
      </div>}
      right={<div className="w-full md:flex-1 p-6 overflow-y-auto">
        {/* <Editor question={question.text} /> */}
      </div>}
      
  />
  </div>
);
}

