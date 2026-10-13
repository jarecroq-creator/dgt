import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'conduce-dgt-study-v1';

export type StudySession = {
  id: string;
  mode: 'topic' | 'group' | 'exam' | 'review';
  score: number;
  total: number;
  answeredCount: number;
  errors: number;
  passed: boolean | null;
  date: string;
};

type StudyData = {
  sessions: StudySession[];
  answered: number;
  correct: number;
  examsPassed: number;
  wrongQuestionIds: string[];
};

type StudyContextValue = StudyData & {
  ready: boolean;
  recordSession: (session: Omit<StudySession, 'id' | 'date'>, wrongIds: string[], correctIds: string[]) => void;
};

const initialData: StudyData = {
  sessions: [],
  answered: 0,
  correct: 0,
  examsPassed: 0,
  wrongQuestionIds: [],
};

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyData>(initialData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!active) return;
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<StudyData>;
          setData({
            sessions: parsed.sessions ?? [],
            answered: parsed.answered ?? 0,
            correct: parsed.correct ?? 0,
            examsPassed: parsed.examsPassed ?? 0,
            wrongQuestionIds: parsed.wrongQuestionIds ?? [],
          });
        }
      })
      .catch(() => {
        // Keep the app usable if local study data cannot be read.
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {
        // Progress remains available for this session if storage is unavailable.
      });
    }
  }, [data, ready]);

  const recordSession = (session: Omit<StudySession, 'id' | 'date'>, wrongIds: string[], correctIds: string[]) => {
    setData((current) => ({
      ...current,
      sessions: [
        { ...session, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString() },
        ...current.sessions,
      ].slice(0, 30),
      answered: current.answered + session.answeredCount,
      correct: current.correct + session.score,
      examsPassed: current.examsPassed + (session.mode === 'exam' && session.passed ? 1 : 0),
      wrongQuestionIds: Array.from(new Set([
        ...current.wrongQuestionIds.filter((id) => !correctIds.includes(id)),
        ...wrongIds,
      ])),
    }));
  };

  const value = useMemo(() => ({ ...data, ready, recordSession }), [data, ready]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy debe usarse dentro de StudyProvider');
  return value;
}
