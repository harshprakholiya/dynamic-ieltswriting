import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import Image from "next/image";
import Editor from "../../../components/Editor"; // Reuse your existing Editor component
import type { Question } from "@prisma/client";

export default async function Page({ params }: { params: { id: string } }) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!question) return notFound();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Pane */}
      <div className="w-full md:w-1/2 overflow-y-auto p-6 bg-gray-50 border-r">
        <h2 className="text-xl font-semibold mb-4">
          {question.type === "part1" ? "Part 1 Question" : "Part 2 Question"}
        </h2>

        <div className="border p-4 rounded-md bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-1 capitalize">
            Type: {question.type}
          </div>
          <div className="text-base mb-3">{question.text}</div>
          {question.image && (
            <Image
              src={question.image}
              alt="Question"
              width={400}
              height={250}
              className="rounded shadow-md"
            />
          )}
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full md:flex-1 overflow-y-auto p-6">
        <Editor question={question.text} />
      </div>
    </div>
  );
}
