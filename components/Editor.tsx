'use client';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import useAutoSave from '../hooks/useAutoSave';
import useTimer from '../hooks/useTimer';
import DifficultySelector from './Editor/DifficultySelector';
import PartSelector from './Editor/PartSelector';
import SpellCheckToggle from './Editor/SpellCheckToggle';
import QuestionDisplay from './Editor/QuestionDisplay';
import EssayTextarea from './Editor/EssayTextarea';
import PDFButtonGroup from './Editor/PDFButtonGroup';
import TimerBar from './Editor/TimerBar';

// import TimerBar from '@/components/editor/TimerBar';
// import DifficultySelector from '@/components/editor/DifficultySelector';
// import PartSelector from '@/components/editor/PartSelector';
// import SpellCheckToggle from '@/components/editor/SpellCheckToggle';
// import QuestionDisplay from '@/components/editor/QuestionDisplay';
// import EssayTextarea from '@/components/editor/EssayTextarea';
// import PDFButtonGroup from '@/components/editor/PDFButtonGroup';

// import useAutoSave from '@/hooks/useAutoSave';
// import useTimer from '@/hooks/useTimer';

const LOCAL_STORAGE_KEY = 'ielts_editor_data';

type PartType = 'PART 1' | 'PART 2';
type DifficultyType = 'Practice' | 'Exam' | 'Hardcore';

interface EditorProps {
  question: string;
}

const Editor: React.FC<EditorProps> = ({ question }) => {
  const [text, setText] = useState('');
  const [selectedPart, setSelectedPart] = useState<PartType>('PART 1');
  const [difficulty, setDifficulty] = useState<DifficultyType>('Practice');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isSpellCheck, setIsSpellCheck] = useState(true);

  const getTimeForDifficulty = (part: PartType, diff: DifficultyType): number => {
    if (diff === 'Practice') return 0;
    if (diff === 'Exam') return part === 'PART 1' ? 20 * 60 : 40 * 60;
    if (diff === 'Hardcore') return part === 'PART 1' ? 18 * 60 : 35 * 60;
    return 0;
  };

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setText(parsed.text || '');
      setSelectedPart(parsed.selectedPart || 'PART 1');
      setDifficulty(parsed.difficulty || 'Practice');
      const defaultTime = getTimeForDifficulty(
        parsed.selectedPart,
        parsed.difficulty || 'Practice'
      );
      setTimeLeft(parsed.timeLeft ?? defaultTime);
      setTimerRunning(parsed.timerRunning ?? false);
    }
  }, []);

  useAutoSave(
    LOCAL_STORAGE_KEY,
    { text, selectedPart, timeLeft, timerRunning, difficulty },
    () => {
      setShowSavedMessage(true);
      const timer = setTimeout(() => setShowSavedMessage(false), 1500);
      return () => clearTimeout(timer);
    }
  );

  useTimer(timerRunning, timeLeft, setTimeLeft, () => {
    setTimerRunning(false);
    downloadPDF();
  });

  const startTimer = () => {
    if (difficulty !== 'Practice') setIsSpellCheck(false);
    setTimeLeft(getTimeForDifficulty(selectedPart, difficulty));
    setTimerRunning(true);
  };

  const stopTimer = () => {
    if (difficulty === 'Practice') setTimerRunning(false);
  };

  const clearTextOnly = () => {
    if (window.confirm('Clear only essay text?')) setText('');
  };

  const clearAll = () => {
    if (window.confirm('Clear everything and reset?')) {
      setText('');
      setSelectedPart('PART 1');
      setDifficulty('Practice');
      setTimeLeft(0);
      setIsSpellCheck(true);
      setTimerRunning(false);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const downloadPDF = () => {
    const wordCount = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
    const doc = new jsPDF();
    const date = new Date().toISOString().split('T')[0];

    const title = `IELTS ${selectedPart} - ${date}`;
    const content = `${title}\n\nQuestion: ${question}\n\n${text}\n\n---\nWords: ${wordCount}, Difficulty: ${difficulty}`;
    const lines = doc.splitTextToSize(content, 180);

    let y = 20;
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 6;
    });

    doc.save(`IELTS_${selectedPart}_${date}.pdf`);
    clearAll();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f3f5] p-4 font-[Arial]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10 relative">
        <header className="relative mb-10 border-b border-[#d4d4d4] pb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 tracking-wide">
            IELTS Writing Practice
          </h1>
          {showSavedMessage && (
            <div className="fixed bottom-4 left-4 bg-[#FCCD06] text-[#000] text-sm font-medium px-4 py-1.5 rounded shadow-md opacity-80 transition duration-300 z-30">
              Auto-saved
            </div>
          )}
        </header>

        <div className="pb-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex gap-4 w-full md:w-auto">
              <DifficultySelector
                value={difficulty}
                disabled={timerRunning}
                onChange={(val: string) => setDifficulty(val as DifficultyType)}
              />
              <PartSelector
                value={selectedPart}
                disabled={timerRunning}
                onChange={(val: string) => setSelectedPart(val as PartType)}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto justify-center">
              {!timerRunning ? (
                <button
                  onClick={startTimer}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                >
                  Start Timer
                </button>
              ) : difficulty === 'Practice' ? (
                <button
                  onClick={stopTimer}
                  className="px-6 py-2 bg-[#000] text-white font-semibold rounded-md hover:bg-[#222] transition"
                >
                  Stop Timer
                </button>
              ) : null}
            </div>
          </div>

          <div className="mb-6 rounded-md">
            <SpellCheckToggle
              isEnabled={isSpellCheck}
              disabled={difficulty !== 'Practice'}
              onToggle={() => setIsSpellCheck(!isSpellCheck)}
            />
          </div>

          <QuestionDisplay question={question} />

          <EssayTextarea
            value={text}
            onChange={setText}
            spellCheck={isSpellCheck}
            disabled={difficulty !== 'Practice' && !timerRunning}
          />

          <div className="text-right text-sm text-[#000] mb-8">
            Word Count: <span className="font-semibold">{text.trim().split(/\s+/).length}</span>
          </div>

          <PDFButtonGroup
            onDownload={downloadPDF}
            onClearText={clearTextOnly}
            onClearAll={clearAll}
          />
        </div>

        <TimerBar
          difficulty={difficulty}
          timeLeft={timeLeft}
          maxTime={getTimeForDifficulty(selectedPart, difficulty)}
        />
      </div>
    </div>
  );
};

export default Editor;
