"use client";

import { useState } from "react";

export default function QuestionForm({ onSuccessAction }: { onSuccessAction?: () => void }) {
  const [type, setType] = useState<"part1" | "part2">("part1");
  const [text, setText] = useState("");
  const [subtype, setSubtype] = useState("general");  // <-- add subtype state
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("text", text);
    formData.append("subtype", subtype);  // <-- send subtype
    if (file) formData.append("image", file);

    const res = await fetch("/api/questions", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setType("part1");
      setText("");
      setSubtype("general");
      setFile(null);
      if (onSuccessAction) onSuccessAction();
    } else {
      alert("Failed to add question");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <div>
        <label className="block font-semibold mb-1">Question Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "part1" | "part2")}
          className="border rounded p-2 w-full"
          required
        >
          <option value="part1">Part 1</option>
          <option value="part2">Part 2</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Subtype</label>
        <input
          type="text"
          value={subtype}
          onChange={(e) => setSubtype(e.target.value)}
          placeholder="Enter subtype (e.g. academic)"
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Question Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter question text"
          className="border rounded p-2 w-full"
          rows={3}
          required
        />
      </div>

      {type === "part1" && (
        <div>
          <label className="block font-semibold mb-1">Optional Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Saving..." : "Add Question"}
      </button>
    </form>
  );
}
