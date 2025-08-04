'use client';

import { useState } from 'react';

type Props = {
  onSuccessAction?: () => void;
};

export default function QuestionForm({ onSuccessAction }: Props) {
  const [type, setType] = useState<'part1' | 'part2'>('part1');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      setError('Question text is required.');
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('type', type);
    formData.append('text', text);
    if (image && type === 'part1') formData.append('image', image);

    const res = await fetch('/api/questions', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      setError('Failed to submit question.');
      return;
    }

    setText('');
    setImage(null);
    onSuccessAction?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'part1' | 'part2')}
        className="w-full p-2 border rounded"
      >
        <option value="part1">Part 1</option>
        <option value="part2">Part 2</option>
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter question text"
        className="w-full p-2 border rounded h-32"
        required
      />

      {type === 'part1' && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
