'use client';

import { useState } from 'react';

export default function AddExamForm() {
  const [title, setTitle] = useState('');
  const [part1Text, setPart1Text] = useState('');
  const [part1Subtype, setPart1Subtype] = useState('bar');
  const [part1Image, setPart1Image] = useState<File | null>(null);

  const [part2Text, setPart2Text] = useState('');
  const [part2Subtype, setPart2Subtype] = useState('opinion');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('part1Text', part1Text);
    formData.append('part1Subtype', part1Subtype);
    formData.append('part2Text', part2Text);
    formData.append('part2Subtype', part2Subtype);
    if (part1Image) formData.append('part1Image', part1Image);

    const res = await fetch('/api/exams', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Exam created!');
      window.location.reload();
    } else {
      alert('Failed to create exam');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">Create New Exam</h2>

      <input
        type="text"
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />

      {/* Part 1 */}
      <div>
        <h3 className="text-lg font-medium mt-4 mb-2">Part 1 (Image Description)</h3>
        <select
          value={part1Subtype}
          onChange={(e) => setPart1Subtype(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Graph</option>
          <option value="table">Table</option>
          <option value="pie">Pie Chart</option>
          <option value="map">Map</option>
          <option value="process">Process Diagram</option>
          <option value="multiple">Multiple Charts</option>
        </select>
        <textarea
          value={part1Text}
          onChange={(e) => setPart1Text(e.target.value)}
          placeholder="Enter Part 1 question..."
          required
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPart1Image(e.target.files?.[0] || null)}
          className="block"
        />
      </div>

      {/* Part 2 */}
      <div>
        <h3 className="text-lg font-medium mt-6 mb-2">Part 2 (Essay)</h3>
        <select
          value={part2Subtype}
          onChange={(e) => setPart2Subtype(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="opinion">Opinion (Agree/Disagree)</option>
          <option value="both">Both Views</option>
          <option value="adv">Advantage/Disadvantage</option>
          <option value="problem">Problem/Solution</option>
          <option value="double">Double Questions</option>
        </select>
        <textarea
          value={part2Text}
          onChange={(e) => setPart2Text(e.target.value)}
          placeholder="Enter Part 2 question..."
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create Exam
      </button>
    </form>
  );
}
