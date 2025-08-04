
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import Editor from '../../../components/Editor';

interface Props {
  params: { id: string };
}

export default async function StudentSplitView({ params }: Props) {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const active = questions.find((q) => q.id === params.id);
  if (!active) return notFound();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Pane - Questions List */}
      <div className="w-full md:w-1/2 border-r overflow-y-auto p-4 space-y-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-center mb-4">Available Questions</h2>

        {/* Part 1 */}
        <div>
          <h3 className="text-lg font-medium text-blue-700 mb-2">Part 1 (Image)</h3>
          {questions
            .filter((q) => q.type === 'part1')
            .map((q) => (
              <Link
                href={`/student/${q.id}`}
                key={q.id}
                className={`block p-3 rounded border ${
                  q.id === active.id ? 'bg-yellow-100 border-yellow-500' : 'bg-white'
                } mb-3 hover:shadow transition`}
              >
                <div className="text-sm text-gray-500 mb-1">ID: {q.id.slice(0, 6)}...</div>
                <p className="text-sm mb-2">{q.text}</p>
                {q.image && (
                  <Image
                    src={q.image}
                    alt="Question image"
                    width={300}
                    height={200}
                    className="rounded shadow-md"
                  />
                )}
              </Link>
            ))}
        </div>

        {/* Part 2 */}
        <div>
          <h3 className="text-lg font-medium text-green-700 mt-6 mb-2">Part 2 (Essay)</h3>
          {questions
            .filter((q) => q.type === 'part2')
            .map((q) => (
              <Link
                href={`/student/${q.id}`}
                key={q.id}
                className={`block p-3 rounded border ${
                  q.id === active.id ? 'bg-yellow-100 border-yellow-500' : 'bg-white'
                } mb-3 hover:shadow transition`}
              >
                <div className="text-sm text-gray-500 mb-1">ID: {q.id.slice(0, 6)}...</div>
                <p className="text-sm">{q.text}</p>
              </Link>
            ))}
        </div>
      </div>

      {/* Right Pane - Editor */}
      <div className="w-full md:w-1/2 overflow-y-auto">
        <Editor question={active.text} />
      </div>
    </div>
  );
}
