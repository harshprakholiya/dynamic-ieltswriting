// ============================
// app/student/exams/page.tsx
// ============================
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function StudentExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800">Available IELTS Exams</h1>

      <ul className="space-y-6">
        {exams.map((exam: { id: string; title: string; createdAt: Date }) => (
          <li
            key={exam.id}
            className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
                <p className="text-sm text-gray-500">
                  Created on {new Date(exam.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Link href={`/student/exams/${exam.id}?mode=simple`}>Start Simple Exam</Link>
<Link href={`/student/exams/${exam.id}?mode=hard`}>Start Hardcore Exam</Link>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
