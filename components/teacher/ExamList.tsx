"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

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

export default function ExamList({ exams }: { exams: ExamWithQuestions[] }) {
  const [examList, setExamList] = useState(exams);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    startTransition(async () => {
      const res = await fetch(`/api/exams/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Exam deleted!");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Failed to delete exam: ${data.error}`);
      }
    });
  };

  return (
    <div className="space-y-8">
      {examList.map((exam) => (
        <div
          key={exam.id}
          className="p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-4"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">
              📚 {exam.title}
            </h2>
            <button
              onClick={() => handleDelete(exam.id)}
              disabled={isPending}
              className={`text-red-600 text-sm hover:underline ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>

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

          <div className="space-y-1">
            <h3 className="text-md font-bold text-green-700">
              Part 2 ({exam.part2.subtype})
            </h3>
            <p className="text-gray-700">{exam.part2.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
