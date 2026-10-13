import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/state/StudyContext';
import { ActionButton, Card, Metric, PageTitle } from '@/components/StudyUI';
import { Grid, ScreenScroll } from '@/components/Screen';
import { InstallTip } from '@/components/InstallTip';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { questions, topics } from '@/data/questions';

const featuredTopics = ['actualidad', 't08', 't10'].map((id) => topics.find((topic) => topic.id === id)).filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const study = useStudy();
  const { isTablet } = useBreakpoint();
  const accuracy = study.answered ? Math.round((study.correct / study.answered) * 100) : 0;

  return (
    <ScreenScroll topPadding={18} bottomPadding={118}>
      <View style={styles.topLine}>
        <View>
          <Text style={[styles.brand, { color: colors.primary }]}>¡¡Vamos Ana!!</Text>
          <Text style={[styles.brandSub, { color: colors.mutedForeground }]}>¡¡Esta vez sí lo aprobamos!!</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Feather name="navigation" size={19} color={colors.accentForeground} />
        </View>
      </View>

      <PageTitle eyebrow="Tu preparación" title="Cada test te acerca a aprobar." detail="Estudia a tu ritmo y convierte los fallos en aciertos." />

      <InstallTip />

      <View style={[styles.hero, { backgroundColor: colors.primary }, isTablet && styles.heroWide]}>
        <View style={[styles.heroCopy, isTablet && { flex: 1 }]}>
          <Text style={[styles.heroEyebrow, { color: colors.primaryMuted }]}>SIMULACRO TIPO DGT</Text>
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>¿Listo para{'\n'}ponerte a prueba?</Text>
          <Text style={[styles.heroDetail, { color: colors.primaryMuted }]}>30 preguntas · 30 minutos · máximo 3 fallos</Text>
        </View>
        <View style={isTablet ? styles.heroAction : undefined}>
          <ActionButton label="Hacer un examen" onPress={() => router.push({ pathname: '/quiz', params: { mode: 'exam' } })} secondary />
        </View>
        <View style={[styles.roadDecoration, isTablet && { right: 285 }]}>
          <View style={styles.roadLine} />
          <View style={styles.roadLine} />
          <View style={styles.roadLine} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tu avance</Text>
        <Pressable onPress={() => router.navigate('/progress')} accessibilityRole="button" testID="link-see-progress">
          <Text style={[styles.link, { color: colors.primary }]}>Ver progreso</Text>
        </Pressable>
      </View>
      <Card>
        <View style={styles.metricsRow}>
          <Metric label="Preguntas" value={study.answered} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Metric label="Aciertos" value={`${accuracy}%`} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Metric label="Exámenes aprobados" value={study.examsPassed} />
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${accuracy}%` }]} />
        </View>
        <Text style={[styles.progressNote, { color: colors.mutedForeground }]}>{study.sessions.length ? 'Sigue practicando para consolidar lo aprendido.' : 'Completa tu primer test para empezar a ver tu evolución.'}</Text>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Empieza por un tema</Text>
        <Pressable onPress={() => router.navigate('/practice')} accessibilityRole="button">
          <Text style={[styles.link, { color: colors.primary }]}>Ver todos</Text>
        </Pressable>
      </View>
      <Grid>
      {featuredTopics.map((topic) => (
        <Pressable
          key={topic.id}
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'topic', topics: topic.id } })}
          style={({ pressed }) => [styles.topicRow, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}
          accessibilityRole="button"
          testID={`topic-${topic.id}`}
        >
          <View style={[styles.topicIcon, { backgroundColor: topic.color === 'amber' ? colors.accent : colors.secondary }]}>
            <Feather name={topic.icon as keyof typeof Feather.glyphMap} size={18} color={topic.color === 'amber' ? colors.accentForeground : colors.primary} />
          </View>
          <View style={styles.topicCopy}>
            <Text style={[styles.topicName, { color: colors.foreground }]}>{topic.title}</Text>
            <Text style={[styles.topicInfo, { color: colors.mutedForeground }]}>Test rápido · {questions.filter((question) => question.topicId === topic.id).length} preguntas</Text>
          </View>
          <Feather name="chevron-right" size={19} color={colors.mutedForeground} />
        </Pressable>
      ))}
      </Grid>
      <Text style={[styles.sourceNote, { color: colors.mutedForeground }]}>Contenido revisado el 13 de octubre de 2026. Preguntas propias basadas en temas del Manual DGT Permiso B y normativa vigente; no son preguntas oficiales literales.</Text>
      <View style={styles.sources}>
        <Pressable onPress={() => Linking.openURL('https://www.dgt.es/comunicacion/notas-de-prensa/20260930-reforma-del-reglamento-de-circulacion-usuarios-vulnerables/').catch(() => undefined)} accessibilityRole="link" testID="source-dgt-2026">
          <Text style={[styles.sourceLink, { color: colors.primary }]}>Reforma DGT 2026</Text>
        </Pressable>
        <Text style={[styles.sourceDot, { color: colors.mutedForeground }]}>·</Text>
        <Pressable onPress={() => Linking.openURL('https://www.dgt.es/muevete-con-seguridad/tecnologia-e-innovacion-en-carretera/Dispositivos-de-presenalizacion-V16').catch(() => undefined)} accessibilityRole="link" testID="source-v16">
          <Text style={[styles.sourceLink, { color: colors.primary }]}>V16 conectada</Text>
        </Pressable>
        <Text style={[styles.sourceDot, { color: colors.mutedForeground }]}>·</Text>
        <Pressable onPress={() => Linking.openURL('https://www.boe.es/buscar/doc.php?id=BOE-A-2026-13889').catch(() => undefined)} accessibilityRole="link" testID="source-boe">
          <Text style={[styles.sourceLink, { color: colors.primary }]}>Texto BOE</Text>
        </Pressable>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 28 },
  brand: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  brandSub: { marginTop: 3, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  avatar: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  hero: { overflow: 'hidden', borderRadius: 24, padding: 20, gap: 17, marginBottom: 27 },
  heroWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 28 },
  heroAction: { width: 240, zIndex: 1 },
  heroCopy: { zIndex: 1 },
  heroEyebrow: { fontSize: 10, letterSpacing: 1.5, fontFamily: 'Inter_700Bold' },
  heroTitle: { fontSize: 27, lineHeight: 32, marginTop: 10, fontFamily: 'Inter_700Bold' },
  heroDetail: { fontSize: 12, marginTop: 8, fontFamily: 'Inter_500Medium' },
  roadDecoration: { position: 'absolute', right: 25, top: -8, bottom: -8, width: 55, backgroundColor: 'rgba(255,255,255,0.08)', transform: [{ rotate: '16deg' }], justifyContent: 'space-around', alignItems: 'center' },
  roadLine: { height: 22, width: 3, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  link: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  metricsRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  divider: { height: 34, width: 1 },
  progressTrack: { height: 7, borderRadius: 4, marginTop: 17, overflow: 'hidden' },
  progressFill: { height: 7, borderRadius: 4 },
  progressNote: { marginTop: 9, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  topicRow: { borderRadius: 18, borderWidth: 1, padding: 13, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 12 },
  topicIcon: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  topicCopy: { flex: 1, gap: 3 },
  topicName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topicInfo: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  sourceNote: { fontSize: 10, lineHeight: 15, marginTop: 12, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  sources: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 9 },
  sourceLink: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  sourceDot: { fontSize: 12 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
});
