"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { Question } from "@prisma/client";
import Editor from "./Editor";

export default function SplitView({ question }: { question: Question }) {
  const [leftWidth, setLeftWidth] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftWidth(newLeftWidth);
      }
    }

    function handleMouseUp() {
      isResizing.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function startResizing() {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  return (
    <div ref={containerRef} className="flex flex-row h-screen overflow-hidden">
      <div
        className="overflow-y-auto p-6 bg-gray-50 border-r"
        style={{ width: `${leftWidth}%` }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {question.type === "part1" ? "Part 1 Question" : "Part 2 Question"}
        </h2>

        <div className="border p-4 rounded-md bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-1 capitalize">
            Type: {question.type}
          </div>
          <div className="text-base mb-3">{question.text}</div>
          {question.image && (
            <Image
              src={question.image}
              alt="Question"
              width={400}
              height={250}
              className="rounded shadow-md"
            />
          )}
        </div>
      </div>

      <div
        className="w-1 bg-gray-300 cursor-col-resize"
        onMouseDown={startResizing}
      />

      <div className="overflow-y-auto p-6 flex-1">
        <Editor question={question.text} />
      </div>
    </div>
  );
}
