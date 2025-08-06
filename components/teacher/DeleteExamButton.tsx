'use client';

import { useTransition } from "react";

export default function DeleteExamButton({ examId }: { examId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    const res = await fetch(`/api/exams?id=${examId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Refresh page after deletion
      startTransition(() => {
        window.location.reload(); // simple way
      });
    } else {
      alert("Failed to delete exam");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
