// =================================
// components/student/ExamEditor.tsx
// =================================
"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import TimerBar from "../Editor/TimerBar";
import Image from "next/image";

interface Question {
  id: string;
  text: string;
  subtype: string;
  image?: string | null;
}

interface Props {
  examId: string;
  part1: Question;
  part2: Question;
  mode: "simple" | "hard";
}

export default function ExamEditor({ examId, part1, part2, mode }: Props) {
  const initialTime = mode === "hard" ? 50 * 60 : 60 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const savedTime = localStorage.getItem(`exam-${examId}-timeLeft`);
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }
  }, [examId]);

  const [timerRunning, setTimerRunning] = useState(true);
  const [spellCheck, setSpellCheck] = useState(false);
  const [part1Answer, setPart1Answer] = useState("");
  const [part2Answer, setPart2Answer] = useState("");
  const [loading, setLoading] = useState(false);

  const wordCount = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  // Autosave answers in localStorage with fresh start logic
  useEffect(() => {
    const startedKey = `exam-${examId}-started`;

    if (!localStorage.getItem(startedKey)) {
      localStorage.setItem(startedKey, "true");
      localStorage.removeItem(`exam-${examId}-part1`);
      localStorage.removeItem(`exam-${examId}-part2`);
      return;
    }

    const savedPart1 = localStorage.getItem(`exam-${examId}-part1`);
    const savedPart2 = localStorage.getItem(`exam-${examId}-part2`);
    if (savedPart1) setPart1Answer(savedPart1);
    if (savedPart2) setPart2Answer(savedPart2);
  }, [examId]);

  useEffect(() => {
    localStorage.setItem(`exam-${examId}-part1`, part1Answer);
  }, [part1Answer, examId]);

  useEffect(() => {
    localStorage.setItem(`exam-${examId}-part2`, part2Answer);
  }, [part2Answer, examId]);

  useEffect(() => {
    localStorage.setItem(`exam-${examId}-timeLeft`, timeLeft.toString());
  }, [timeLeft, examId]);

  const downloadPDF = async () => {
    setLoading(true);

    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(11);

    const margin = 20;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    const totalTimeTaken = initialTime - timeLeft;
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    };

    const writeLine = (text: string, fontStyle = "normal") => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", fontStyle);
      doc.text(text, margin, y);
      y += lineHeight;
    };

    const writeParagraph = (text: string) => {
      const lines = doc.splitTextToSize(text, pageWidth);
      for (const line of lines) {
        writeLine(line);
      }
      y += 2;
    };

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    writeLine(`IELTS Exam - ${mode.toUpperCase()} Mode`);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    writeLine(`Time Taken: ${formatTime(totalTimeTaken)}`);
    y += 6;

    doc.setFont("helvetica", "bold");
    writeLine(`Part 1 [${part1?.subtype}]`);
    doc.setFont("helvetica", "normal");
    y += 2;

    writeLine("Question:", "bold");
    writeParagraph(part1?.text ?? "");
    writeLine("Answer:", "bold");
    writeParagraph(part1Answer);
    writeLine(`Word Count: ${wordCount(part1Answer)}`);
    y += 6;

    doc.setFont("helvetica", "bold");
    writeLine(`Part 2 [${part2?.subtype}]`);
    doc.setFont("helvetica", "normal");
    y += 2;

    writeLine("Question:", "bold");
    writeParagraph(part2?.text ?? "");
    writeLine("Answer:", "bold");
    writeParagraph(part2Answer);
    writeLine(`Word Count: ${wordCount(part2Answer)}`);

    doc.save(`IELTS-Exam-${mode}.pdf`);
    setLoading(false);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      downloadPDF();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">IELTS Exam</h1>
        <TimerBar timeLeft={timeLeft} difficulty={mode} maxTime={initialTime} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-blue-700">
              Part 1 ({part1?.subtype ?? ""})
            </h2>
            <p className="text-gray-800 whitespace-pre-line">
              {part1?.text ?? ""}
            </p>
            {part1?.image && (
              <Image
                src={part1.image}
                alt="Part 1"
                className="w-full max-w-md border rounded"
                width={500}
                height={300}
              />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-green-700">
              Part 2 ({part2?.subtype ?? ""})
            </h2>
            <p className="text-gray-800 whitespace-pre-line">
              {part2?.text ?? ""}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Part 1 Answer
            </label>
            <textarea
              className="w-full h-48 p-4 border rounded bg-white text-gray-800 text-sm"
              placeholder="Write your Part 1 response here..."
              value={part1Answer}
              onChange={(e) => setPart1Answer(e.target.value)}
              spellCheck={spellCheck}
            />
            <div className="text-right text-sm text-gray-500">
              Word Count: {wordCount(part1Answer)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Part 2 Answer
            </label>
            <textarea
              className="w-full h-48 p-4 border rounded bg-white text-gray-800 text-sm"
              placeholder="Write your Part 2 response here..."
              value={part2Answer}
              onChange={(e) => setPart2Answer(e.target.value)}
              spellCheck={spellCheck}
            />
            <div className="text-right text-sm text-gray-500">
              Word Count: {wordCount(part2Answer)}
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Preparing PDF..." : "Download Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
