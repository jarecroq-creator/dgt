import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/state/StudyContext';
import { questions, topics } from '@/data/questions';
import { ActionButton, Card, Metric, PageTitle } from '@/components/StudyUI';
import { ScreenScroll } from '@/components/Screen';

const modeName = { topic: 'Tema', group: 'Temas agrupados', exam: 'Examen DGT', review: 'Repaso de fallos' };

export default function ProgressScreen() {
  const colors = useColors();
  const router = useRouter();
  const study = useStudy();
  const accuracy = study.answered ? Math.round(study.correct / study.answered * 100) : 0;
  const wrongQuestions = questions.filter((question) => study.wrongQuestionIds.includes(question.id));

  return (
    <ScreenScroll maxWidth={760} topPadding={22} bottomPadding={120}>
      <PageTitle eyebrow="Tu evolución" title="Progreso" detail="Cada práctica suma. Repasa los errores para afianzar lo importante." />

      <Card>
        <View style={styles.metrics}>
          <Metric label="Preguntas respondidas" value={study.answered} />
          <Metric label="Aciertos" value={`${accuracy}%`} />
        </View>
        <View style={[styles.track, { backgroundColor: colors.muted }]}>
          <View style={[styles.fill, { width: `${accuracy}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.smallNote, { color: colors.mutedForeground }]}>{study.correct} respuestas correctas de {study.answered}</Text>
      </Card>

      <View style={styles.metricsPair}>
        <Card style={styles.smallCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.accent }]}><Feather name="award" size={17} color={colors.accentForeground} /></View>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{study.examsPassed}</Text>
          <Text style={[styles.smallNote, { color: colors.mutedForeground }]}>Exámenes aprobados</Text>
        </Card>
        <Card style={styles.smallCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.secondary }]}><Feather name="activity" size={17} color={colors.primary} /></View>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{study.sessions.length}</Text>
          <Text style={[styles.smallNote, { color: colors.mutedForeground }]}>Tests completados</Text>
        </Card>
      </View>

      <View style={styles.sectionLine}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Repasar fallos</Text>
        <Text style={[styles.badge, { backgroundColor: colors.accent, color: colors.accentForeground }]}>{wrongQuestions.length}</Text>
      </View>
      <Card>
        {wrongQuestions.length ? (
          <>
            <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>Vuelve a intentar las preguntas que fallaste recientemente.</Text>
            <View style={{ marginTop: 13 }}>
              <ActionButton label={`Repasar ${wrongQuestions.length} preguntas`} icon="rotate-ccw" onPress={() => router.push({ pathname: '/quiz', params: { mode: 'review' } })} />
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <Feather name="check-circle" size={22} color={colors.primary} />
            <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{study.answered ? 'No tienes fallos pendientes. ¡Buen trabajo!' : 'Cuando completes tests, aquí podrás repasar tus fallos.'}</Text>
          </View>
        )}
      </Card>

      <View style={styles.sectionLine}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Actividad reciente</Text>
      </View>
      {study.sessions.length ? study.sessions.slice(0, 8).map((session) => {
        const date = new Date(session.date);
        return (
          <View key={session.id} style={[styles.sessionRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.sessionIcon, { backgroundColor: session.passed ? colors.secondary : colors.muted }]}>
              <Feather name={session.passed ? 'check' : 'book-open'} size={16} color={session.passed ? colors.primary : colors.mutedForeground} />
            </View>
            <View style={styles.sessionText}>
              <Text style={[styles.sessionName, { color: colors.foreground }]}>{modeName[session.mode]}</Text>
              <Text style={[styles.sessionDate, { color: colors.mutedForeground }]}>{date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · {session.errors} fallos</Text>
            </View>
            <Text style={[styles.sessionScore, { color: colors.foreground }]}>{session.score}/{session.total}</Text>
          </View>
        );
      }) : (
        <Card>
          <View style={styles.empty}>
            <Feather name="bar-chart-2" size={22} color={colors.mutedForeground} />
            <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>Tu actividad aparecerá después de tu primer test.</Text>
          </View>
        </Card>
      )}

      <Text style={[styles.topicFootnote, { color: colors.mutedForeground }]}>{topics.length} temas · Las estadísticas se guardan en este dispositivo.</Text>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  track: { height: 7, borderRadius: 4, overflow: 'hidden', marginTop: 16 },
  fill: { height: 7, borderRadius: 4 },
  smallNote: { fontSize: 11, lineHeight: 16, marginTop: 8, fontFamily: 'Inter_400Regular' },
  metricsPair: { flexDirection: 'row', gap: 10 },
  smallCard: { flex: 1, minHeight: 120, justifyContent: 'center' },
  statIcon: { width: 34, height: 34, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginBottom: 9 },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  sectionLine: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 12, marginBottom: 11 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, fontSize: 11, overflow: 'hidden', fontFamily: 'Inter_700Bold' },
  bodyText: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  empty: { alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 7 },
  sessionRow: { borderBottomWidth: 1, minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 11 },
  sessionIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sessionText: { flex: 1, gap: 4 },
  sessionName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  sessionDate: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  sessionScore: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  topicFootnote: { textAlign: 'center', fontSize: 10, marginTop: 18, fontFamily: 'Inter_400Regular' },
});
