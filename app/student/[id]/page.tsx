import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import Editor from "../../../components/Editor";
import Image from "next/image";

export const metadata = {
  title: "IELTS Writing Question",
  description: "Write your answer in the editor",
};

const Page = async ({ params }: { params: { id: string } }) => {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!question) return notFound();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Side */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-gray-50 border-r">
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
      </div>

      {/* Right Side */}
      <div className="w-full md:flex-1 p-6 overflow-y-auto">
        <Editor question={question.text} />
      </div>
    </div>
  );
};

export default Page;
