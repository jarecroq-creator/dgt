import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { ActionButton, Card, PageTitle } from '@/components/StudyUI';
import { Grid, ScreenScroll } from '@/components/Screen';
import { questions, topics } from '@/data/questions';

export default function PracticeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <ScreenScroll topPadding={22} bottomPadding={128}>
      <PageTitle eyebrow="Entrena a tu manera" title="Practicar" detail="Elige un tema o combina varios para un test personalizado." />

      <Pressable
        onPress={() => router.push({ pathname: '/quiz', params: { mode: 'exam' } })}
        style={({ pressed }) => [styles.examCard, { backgroundColor: colors.primary }, pressed && styles.pressed]}
        accessibilityRole="button"
        testID="start-dgt-exam"
      >
        <View style={[styles.examIcon, { backgroundColor: colors.card }]}><Feather name="award" size={20} color={colors.primary} /></View>
        <View style={styles.examCopy}>
          <Text style={[styles.examTitle, { color: colors.primaryForeground }]}>Examen tipo DGT</Text>
          <Text style={[styles.examSubtitle, { color: colors.primaryMuted }]}>30 preguntas · 30 min · 3 fallos máximo</Text>
        </View>
        <Feather name="arrow-up-right" size={20} color={colors.primaryForeground} />
      </Pressable>

      <View style={styles.sectionTitleLine}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Test por tema</Text>
        <Text style={[styles.caption, { color: colors.mutedForeground }]}>Por tema</Text>
      </View>
      <Grid>
      {topics.map((topic) => (
        <Card key={topic.id} style={styles.topicCard}>
          <View style={styles.topicTop}>
            <View style={[styles.topicIcon, { backgroundColor: topic.color === 'amber' ? colors.accent : colors.secondary }]}>
              <Feather name={topic.icon as keyof typeof Feather.glyphMap} size={18} color={topic.color === 'amber' ? colors.accentForeground : colors.primary} />
            </View>
            <View style={styles.topicText}>
              <Text style={[styles.topicTitle, { color: colors.foreground }]}>{topic.title}</Text>
              <Text style={[styles.topicDetail, { color: colors.mutedForeground }]}>{topic.subtitle} · {questions.filter((question) => question.topicId === topic.id).length} preguntas</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push({ pathname: '/quiz', params: { mode: 'topic', topics: topic.id } })}
            style={({ pressed }) => [styles.topicAction, { borderTopColor: colors.border }, pressed && styles.pressed]}
            accessibilityRole="button"
            testID={`practice-topic-${topic.id}`}
          >
            <Text style={[styles.topicActionText, { color: colors.primary }]}>Empezar test</Text>
            <Feather name="arrow-right" size={16} color={colors.primary} />
          </Pressable>
        </Card>
      ))}
      </Grid>

      <View style={styles.sectionTitleLine}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Combinar temas</Text>
      </View>
      <Text style={[styles.helper, { color: colors.mutedForeground }]}>Selecciona dos o más temas y crea una práctica variada.</Text>
      <Grid>
      {topics.map((topic) => {
        const checked = selected.includes(topic.id);
        return (
          <Pressable
            key={`select-${topic.id}`}
            onPress={() => toggle(topic.id)}
            style={({ pressed }) => [styles.selectRow, { backgroundColor: checked ? colors.secondary : colors.card, borderColor: checked ? colors.primary : colors.border }, pressed && styles.pressed]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            testID={`select-topic-${topic.id}`}
          >
            <View style={[styles.checkbox, { borderColor: checked ? colors.primary : colors.input, backgroundColor: checked ? colors.primary : 'transparent' }]}>
              {checked ? <Feather name="check" size={13} color={colors.primaryForeground} /> : null}
            </View>
            <Text style={[styles.selectLabel, { color: colors.foreground }]}>{topic.title}</Text>
            <Text style={[styles.selectCount, { color: colors.mutedForeground }]}>{questions.filter((question) => question.topicId === topic.id).length}</Text>
          </Pressable>
        );
      })}
      </Grid>
      <View style={styles.groupButton}>
        <ActionButton
          label={selected.length < 2 ? 'Selecciona al menos 2 temas' : `Test combinado · ${selected.length} temas`}
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'group', topics: selected.join(',') } })}
          disabled={selected.length < 2}
          icon="layers"
        />
      </View>
      <Text style={[styles.sourceNote, { color: colors.mutedForeground }]}>Revisado el 13 de octubre de 2026. Incluye el Real Decreto 518/2026, vigente desde el 1 de octubre, y marca las medidas que empiezan en 2027.</Text>
      <Pressable onPress={() => Linking.openURL('https://www.dgt.es/comunicacion/notas-de-prensa/20260930-reforma-del-reglamento-de-circulacion-usuarios-vulnerables/').catch(() => undefined)} accessibilityRole="link" testID="practice-source-dgt">
        <Text style={[styles.sourceLink, { color: colors.primary }]}>Consultar las novedades oficiales de la DGT</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  examCard: { borderRadius: 21, minHeight: 83, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 27 },
  examIcon: { height: 43, width: 43, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  examCopy: { flex: 1, gap: 5 },
  examTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  examSubtitle: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  sectionTitleLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  caption: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  topicCard: { padding: 0, overflow: 'hidden' },
  topicTop: { padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  topicIcon: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  topicText: { flex: 1, gap: 4 },
  topicTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topicDetail: { fontSize: 11, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  topicAction: { borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topicActionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  helper: { fontSize: 12, lineHeight: 17, marginBottom: 12, fontFamily: 'Inter_400Regular' },
  selectRow: { borderWidth: 1, borderRadius: 14, minHeight: 51, paddingHorizontal: 13, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 11 },
  checkbox: { height: 21, width: 21, borderWidth: 1.5, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  selectLabel: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  selectCount: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  groupButton: { marginTop: 9 },
  pressed: { opacity: 0.83 },
  sourceNote: { fontSize: 10, lineHeight: 15, marginTop: 18, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  sourceLink: { textAlign: 'center', fontSize: 12, marginTop: 8, fontFamily: 'Inter_600SemiBold' },
});
