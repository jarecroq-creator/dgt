import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/state/StudyContext';
import { Question, questions, topics } from '@/data/questions';
import { ActionButton, Card } from '@/components/StudyUI';
import { Column } from '@/components/Screen';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type Mode = 'topic' | 'group' | 'exam' | 'review';
type QuizAnswer = { questionId: string; selectedIndex: number | null };

function shuffle<T,>(list: T[]): T[] {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function QuizScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; topics?: string }>();
  const study = useStudy();
  const { isTablet } = useBreakpoint();
  const mode = (['topic', 'group', 'exam', 'review'].includes(params.mode ?? '') ? params.mode : 'topic') as Mode;
  const selectedTopics = typeof params.topics === 'string' ? params.topics.split(',').filter(Boolean) : [];
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(mode === 'exam' ? 30 * 60 : 0);
  const [finished, setFinished] = useState(false);
  const hasSaved = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const sessionQuestions = useMemo(() => {
    let pool: Question[] = questions;
    if (mode === 'topic') pool = pool.filter((question) => question.topicId === selectedTopics[0]);
    if (mode === 'group') pool = pool.filter((question) => selectedTopics.includes(question.topicId));
    if (mode === 'review') pool = pool.filter((question) => study.wrongQuestionIds.includes(question.id));
    const amount = mode === 'exam' ? 30 : mode === 'group' ? 15 : pool.length;
    return shuffle(pool).slice(0, amount);
  }, [mode, selectedTopics.join(','), study.wrongQuestionIds.join(',')]);

  const record = useCallback((finalAnswers: QuizAnswer[]) => {
    if (hasSaved.current) return;
    hasSaved.current = true;
    const correctIds = finalAnswers.filter((answer) => {
      const question = sessionQuestions.find((item) => item.id === answer.questionId);
      return answer.selectedIndex !== null && question?.correctIndex === answer.selectedIndex;
    }).map((answer) => answer.questionId);
    const wrongIds = finalAnswers.filter((answer) => !correctIds.includes(answer.questionId)).map((answer) => answer.questionId);
    const score = correctIds.length;
    const total = sessionQuestions.length;
    const errors = total - score;
    const passed = mode === 'exam' ? errors <= 3 : null;
    study.recordSession({ mode, score, total, answeredCount: finalAnswers.length, errors, passed }, wrongIds, correctIds);
    setFinished(true);
  }, [sessionQuestions, mode, study.recordSession]);

  useEffect(() => {
    if (mode !== 'exam' || finished) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          clearInterval(timer);
          record(answersRef.current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, finished, record]);

  const question = sessionQuestions[index];
  const currentAnswer = answers.find((answer) => answer.questionId === question?.id);
  const selectedIndex = currentAnswer?.selectedIndex ?? null;
  const score = answers.reduce((sum, answer) => {
    const match = sessionQuestions.find((item) => item.id === answer.questionId);
    return sum + (answer.selectedIndex !== null && match?.correctIndex === answer.selectedIndex ? 1 : 0);
  }, 0);
  const title = mode === 'exam' ? 'Examen tipo DGT' : mode === 'group' ? 'Test combinado' : mode === 'review' ? 'Repaso de fallos' : 'Test por tema';
  const topicName = topics.find((topic) => topic.id === question?.topicId)?.shortTitle;

  const choose = (optionIndex: number) => {
    if (selectedIndex !== null || finished || !question) return;
    setAnswers((current) => [...current, { questionId: question.id, selectedIndex: optionIndex }]);
    if (optionIndex === question.correctIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  };

  const finishNow = () => record(answersRef.current);
  const next = () => {
    if (index + 1 >= sessionQuestions.length) {
      record(answersRef.current);
    } else {
      setIndex((value) => value + 1);
    }
  };

  // Web: A/B/C or 1/2/3 pick an answer, Enter/Space/→ go on.
  const shortcutRef = useRef({ choose, next, selectedIndex, finished, optionCount: question?.options.length ?? 0 });
  shortcutRef.current = { choose, next, selectedIndex, finished, optionCount: question?.options.length ?? 0 };
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKey = (event: KeyboardEvent) => {
      const state = shortcutRef.current;
      if (state.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      const optionIndex = ['a', 'b', 'c'].indexOf(key) >= 0 ? ['a', 'b', 'c'].indexOf(key) : ['1', '2', '3'].indexOf(key);
      if (optionIndex >= 0 && optionIndex < state.optionCount) {
        event.preventDefault();
        state.choose(optionIndex);
      } else if (state.selectedIndex !== null && (key === 'enter' || key === ' ' || key === 'arrowright')) {
        event.preventDefault();
        state.next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (finished) {
    const errors = sessionQuestions.length - score;
    const passed = mode === 'exam' ? errors <= 3 : null;
    return (
      <View style={[styles.resultScreen, { backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 24 : 34 }]}>
        <View style={styles.resultBody}>
        <View style={[styles.resultIcon, { backgroundColor: passed ? colors.secondary : colors.accent }]}>
          <Feather name={passed ? 'award' : mode === 'exam' ? 'refresh-ccw' : 'check-circle'} size={32} color={passed ? colors.primary : colors.accentForeground} />
        </View>
        <Text style={[styles.resultEyebrow, { color: colors.primary }]}>{mode === 'exam' ? 'SIMULACRO COMPLETADO' : 'SESIÓN COMPLETADA'}</Text>
        <Text style={[styles.resultTitle, { color: colors.foreground }]}>{mode === 'exam' ? passed ? '¡Aprobado!' : 'A seguir practicando' : 'Buen trabajo'}</Text>
        <Text style={[styles.resultDetail, { color: colors.mutedForeground }]}>{mode === 'exam' ? passed ? 'Has superado el límite de errores del examen de práctica.' : 'En el examen tipo DGT se permiten hasta 3 fallos.' : 'Revisa tus respuestas y vuelve sobre lo que necesites reforzar.'}</Text>
        <Card style={styles.resultCard}>
          <View style={styles.resultMetrics}>
            <View style={styles.resultMetric}><Text style={[styles.resultNumber, { color: colors.foreground }]}>{score}/{sessionQuestions.length}</Text><Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Aciertos</Text></View>
            <View style={[styles.resultDivider, { backgroundColor: colors.border }]} />
            <View style={styles.resultMetric}><Text style={[styles.resultNumber, { color: colors.destructive }]}>{errors}</Text><Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Fallos</Text></View>
          </View>
        </Card>
        {errors > 0 ? <View style={styles.resultButton}><ActionButton label="Repasar los fallos" icon="rotate-ccw" onPress={() => router.replace({ pathname: '/quiz', params: { mode: 'review' } })} /></View> : null}
        <View style={styles.resultButton}><ActionButton label="Volver al inicio" secondary onPress={() => router.replace('/(tabs)')} /></View>
        </View>
      </View>
    );
  }

  if (!sessionQuestions.length) {
    return (
      <View style={[styles.emptyScreen, { backgroundColor: colors.background }]}>
        <View style={styles.resultBody}>
        <Feather name={mode === 'review' ? 'check-circle' : 'alert-circle'} size={35} color={colors.primary} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{mode === 'review' ? 'No tienes fallos pendientes' : 'No hay preguntas disponibles'}</Text>
        <Text style={[styles.emptyDetail, { color: colors.mutedForeground }]}>{mode === 'review' ? 'Completa un test y aquí podrás repasar las respuestas que quieras mejorar.' : 'Vuelve a elegir un tema o prueba el examen tipo DGT.'}</Text>
        <View style={{ width: '100%', marginTop: 14 }}><ActionButton label="Volver a practicar" onPress={() => router.replace('/(tabs)/practice')} /></View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 20 : 14 }]}>
      <Column maxWidth={760} style={styles.noPad}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Salir del test" testID="exit-quiz" style={styles.iconButton}>
          <Feather name="x" size={23} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{topicName ?? 'Permiso B'}</Text>
        </View>
        {mode === 'exam' ? (
          <View style={[styles.timer, { backgroundColor: remaining < 300 ? colors.accent : colors.secondary }]}>
            <Feather name="clock" size={14} color={remaining < 300 ? colors.accentForeground : colors.primary} />
            <Text style={[styles.timerText, { color: remaining < 300 ? colors.accentForeground : colors.primary }]}>{formatTime(remaining)}</Text>
          </View>
        ) : <Text style={[styles.counter, { color: colors.mutedForeground }]}>{index + 1}/{sessionQuestions.length}</Text>}
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${((index + (selectedIndex !== null ? 1 : 0)) / sessionQuestions.length) * 100}%` }]} />
      </View>
      </Column>

      <ScrollView style={styles.flex} contentContainerStyle={styles.questionContent} contentInsetAdjustmentBehavior="automatic">
        <Column maxWidth={760} style={styles.pad20}>
        {mode === 'exam' ? <Text style={[styles.examCounter, { color: colors.mutedForeground }]}>PREGUNTA {index + 1} DE 30 <Text style={{ color: colors.primary }}> · {score} aciertos</Text></Text> : null}
        <Text style={[styles.question, { color: colors.foreground }, isTablet && styles.questionWide]}>{question.prompt}</Text>
        <View style={styles.options}>
          {question.options.map((option, optionIndex) => {
            const isCorrect = selectedIndex !== null && optionIndex === question.correctIndex;
            const isWrongSelected = selectedIndex === optionIndex && selectedIndex !== question.correctIndex;
            return (
              <Pressable
                key={`${question.id}-${optionIndex}`}
                onPress={() => choose(optionIndex)}
                disabled={selectedIndex !== null}
                accessibilityRole="button"
                accessibilityState={{ disabled: selectedIndex !== null }}
                testID={`answer-${optionIndex}`}
                style={({ pressed }) => [
                  styles.option,
                  { backgroundColor: colors.card, borderColor: isCorrect ? colors.primary : isWrongSelected ? colors.destructive : colors.border },
                  isCorrect ? { backgroundColor: colors.secondary } : null,
                  isWrongSelected ? { backgroundColor: colors.errorBackground } : null,
                  pressed && selectedIndex === null ? styles.pressed : null,
                ]}
              >
                <View style={[styles.optionLetter, { backgroundColor: isCorrect ? colors.primary : isWrongSelected ? colors.destructive : colors.muted }]}>
                  <Text style={[styles.optionLetterText, { color: isCorrect || isWrongSelected ? colors.primaryForeground : colors.mutedForeground }]}>{String.fromCharCode(65 + optionIndex)}</Text>
                </View>
                <Text style={[styles.optionText, { color: colors.foreground }, isTablet && styles.optionTextWide]}>{option}</Text>
                {isCorrect ? <Feather name="check-circle" size={19} color={colors.primary} /> : isWrongSelected ? <Feather name="x-circle" size={19} color={colors.destructive} /> : null}
              </Pressable>
            );
          })}
        </View>
        {selectedIndex !== null ? (
          <View style={[styles.explanation, { backgroundColor: selectedIndex === question.correctIndex ? colors.secondary : colors.errorBackground }]}>
            <Text style={[styles.explanationTitle, { color: selectedIndex === question.correctIndex ? colors.primary : colors.destructive }]}>{selectedIndex === question.correctIndex ? 'Correcto' : 'No es correcto'}</Text>
            <Text style={[styles.explanationText, { color: colors.foreground }]}>{question.explanation}</Text>
            <Text style={[styles.source, { color: colors.mutedForeground }]}>{question.manualTopic} · Manual DGT Permiso B</Text>
          </View>
        ) : null}
        </Column>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Column maxWidth={760} style={styles.pad20}>
        {selectedIndex !== null ? (
          <ActionButton label={index + 1 === sessionQuestions.length ? 'Ver resultado' : 'Siguiente pregunta'} icon={index + 1 === sessionQuestions.length ? 'bar-chart-2' : 'arrow-right'} onPress={next} />
        ) : mode === 'exam' ? (
          <Pressable onPress={finishNow} accessibilityRole="button" style={styles.finishEarly} testID="finish-exam">
            <Text style={[styles.finishEarlyText, { color: colors.mutedForeground }]}>Finalizar examen</Text>
          </Pressable>
        ) : (
          <Text style={[styles.answerPrompt, { color: colors.mutedForeground }]}>Elige una respuesta para continuar{Platform.OS === 'web' && isTablet ? ' (teclas A · B · C)' : ''}</Text>
        )}
        </Column>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  noPad: { paddingHorizontal: 0 },
  pad20: { paddingHorizontal: 20 },
  resultBody: { width: '100%', maxWidth: 520, alignItems: 'center' },
  questionWide: { fontSize: 27, lineHeight: 36 },
  optionTextWide: { fontSize: 15, lineHeight: 22 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 17, paddingBottom: 15 },
  iconButton: { height: 42, width: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, gap: 3 },
  headerTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  headerSubtitle: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  counter: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  timer: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 12, fontVariant: ['tabular-nums'], fontFamily: 'Inter_700Bold' },
  progressTrack: { height: 4, marginHorizontal: 20, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 4 },
  questionContent: { paddingTop: 25, paddingBottom: 24 },
  examCounter: { fontSize: 10, letterSpacing: 1.1, marginBottom: 16, fontFamily: 'Inter_700Bold' },
  question: { fontSize: 22, lineHeight: 30, marginBottom: 23, fontFamily: 'Inter_700Bold' },
  options: { gap: 10 },
  option: { borderWidth: 1.5, borderRadius: 16, minHeight: 62, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  optionLetter: { height: 31, width: 31, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  optionText: { flex: 1, fontSize: 13, lineHeight: 19, fontFamily: 'Inter_500Medium' },
  explanation: { borderRadius: 16, padding: 15, marginTop: 18, gap: 7 },
  explanationTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  explanationText: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  source: { fontSize: 10, marginTop: 4, fontFamily: 'Inter_500Medium' },
  footer: { borderTopWidth: 1, paddingTop: 12, paddingBottom: Platform.OS === 'web' ? 20 : 18 },
  answerPrompt: { textAlign: 'center', paddingVertical: 16, fontSize: 12, fontFamily: 'Inter_500Medium' },
  finishEarly: { alignItems: 'center', paddingVertical: 15 },
  finishEarlyText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  resultScreen: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  resultIcon: { width: 76, height: 76, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  resultEyebrow: { fontSize: 10, letterSpacing: 1.5, fontFamily: 'Inter_700Bold' },
  resultTitle: { textAlign: 'center', fontSize: 29, marginTop: 8, fontFamily: 'Inter_700Bold' },
  resultDetail: { textAlign: 'center', fontSize: 13, lineHeight: 19, marginTop: 9, marginBottom: 18, fontFamily: 'Inter_400Regular' },
  resultCard: { width: '100%', marginBottom: 10 },
  resultMetrics: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 5 },
  resultMetric: { alignItems: 'center', gap: 5 },
  resultNumber: { fontSize: 25, fontFamily: 'Inter_700Bold' },
  resultLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  resultDivider: { width: 1, height: 42 },
  resultButton: { width: '100%', marginTop: 8 },
  emptyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 25 },
  emptyTitle: { textAlign: 'center', fontSize: 21, marginTop: 15, fontFamily: 'Inter_700Bold' },
  emptyDetail: { textAlign: 'center', fontSize: 13, lineHeight: 19, marginTop: 8, fontFamily: 'Inter_400Regular' },
});
