"use client";

import { useState, useEffect, useTransition } from "react";
import QuestionForm from "../../components/QuestionForm";
import SignoutBtn from "../../components/SignoutBtn";
import Image from "next/image";
import { deleteQuestionAction } from "../actions/deleteQuestion";

type Question = {
  id: string;
  type: "part1" | "part2";
  text: string;
  image: string | null;
};

const TEACHER_PASSWORD = "letmein";

export default function TeacherPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Check localStorage for auth
  useEffect(() => {
    const stored = localStorage.getItem("teacher-auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === TEACHER_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("teacher-auth", "true");
    } else {
      alert("Incorrect password.");
    }
  }

  // Fetch questions
  useEffect(() => {
    fetch("/api/questions?type=part1")
      .then((res) => res.json())
      .then((dataPart1) => {
        fetch("/api/questions?type=part2")
          .then((res) => res.json())
          .then((dataPart2) => {
            setQuestions([...dataPart1, ...dataPart2]);
          });
      });
  }, []);

  // Handle delete manually
  function handleDelete(id: string) {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", id);
        await deleteQuestionAction(formData);
        window.location.reload(); // Refresh to update list
      } catch (err) {
        setErrorMessage((err as Error).message);
      }
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Teacher Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add New IELTS Question</h1>
      <QuestionForm onSuccessAction={() => window.location.reload()} />

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Existing Questions</h2>

      {errorMessage && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
          {errorMessage}
        </div>
      )}

      <ul className="space-y-4" suppressHydrationWarning>
        {questions.map((q) => (
          <li key={q.id} className="border p-4 rounded-md">
            <div className="text-sm text-gray-500 capitalize mb-1">
              Type: {q.type}
            </div>
            <div className="text-base mb-2">{q.text}</div>
            {q.image && (
              <Image
                src={q.image}
                alt="Question image"
                className="max-w-xs border rounded mb-2"
                width={300}
                height={200}
              />
            )}
            <button
              type="button"
              onClick={() => handleDelete(q.id)}
              className="text-red-600 hover:underline text-sm disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
