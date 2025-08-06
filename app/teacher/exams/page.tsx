import Image from "next/image";
import { prisma } from "../../../lib/prisma";
import AddExamForm from "../../../components/teacher/AddExamForm";
import DeleteExamButton from "../../../components/teacher/DeleteExamButton";

export const dynamic = "force-dynamic";

export default async function TeacherExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      part1: true,
      part2: true,
    },
  });

  type ExamWithQuestions = {
    id: string;
    title: string;
    createdAt: Date;
    part1: {
      id: string;
      text: string;
      subtype: string;
      image: string | null;
    };
    part2: {
      id: string;
      text: string;
      subtype: string;
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center">Manage IELTS Exams</h1>

      {/* Exam Form */}
      <div className="p-6 bg-white rounded-xl shadow">
        <AddExamForm />
      </div>

      {/* Exam List */}
      <div className="space-y-8">
  {exams.map((exam: ExamWithQuestions) => (
    <div
      key={exam.id}
      className="p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          📚 {exam.title}
        </h2>
        <DeleteExamButton examId={exam.id} />
      </div>

      {/* Part 1 */}
      <div className="space-y-1">
        <h3 className="text-md font-bold text-blue-700">
          Part 1 ({exam.part1.subtype})
        </h3>
        <p className="text-gray-700">{exam.part1.text}</p>
        {exam.part1.image && (
          <Image
            src={exam.part1.image}
            alt="Part 1 image"
            width={400}
            height={250}
            className="rounded border"
          />
        )}
      </div>

      {/* Part 2 */}
      <div className="space-y-1">
        <h3 className="text-md font-bold text-green-700">
          Part 2 ({exam.part2.subtype})
        </h3>
        <p className="text-gray-700">{exam.part2.text}</p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}
