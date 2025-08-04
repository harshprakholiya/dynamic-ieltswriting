import { useEffect } from 'react';

interface EditorData {
  text: string;
  selectedPart: string;
  timeLeft: number;
  timerRunning: boolean;
  difficulty: string;
}

export default function useAutoSave(
  key: string,
  data: EditorData,
  onSave?: () => void
) {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
    if (onSave) {
      onSave();
    }
  }, [data, key, onSave]);
}
