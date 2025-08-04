// app/student/page.tsx

import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default async function StudentPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Select a Question</h1>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="border p-4 rounded-md">
            <div className="text-sm text-gray-500 capitalize mb-1">Type: {q.type}</div>
            <div className="text-base mb-2">{q.text}</div>
            <Link
              href={`/student/${q.id}`}
              className="inline-block mt-2 text-blue-600 hover:underline text-sm"
            >
              Start Writing
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
