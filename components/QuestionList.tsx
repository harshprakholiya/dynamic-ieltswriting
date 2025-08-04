'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Question = {
  id: string;
  type: 'part1' | 'part2';
  text: string;
  image: string | null;
  createdAt: string;
};

export default function QuestionList({ type }: { type: 'part1' | 'part2' }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/questions?type=${type}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load questions');
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [type]);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (questions.length === 0) return <p>No questions for {type}.</p>;

  return (
    <ul className="space-y-6 mt-4">
      {questions.map((q) => (
        <li key={q.id} className="border rounded p-4 shadow-sm">
          {q.type === 'part1' && q.image && (
            <Image
              src={q.image}
              alt="Part 1"
              className="w-full max-h-64 object-contain mb-4"
              width={640}
              height={480}
            />
          )}
          <p className="text-lg">{q.text}</p>
        </li>
      ))}
    </ul>
  );
}
