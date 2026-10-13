import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function PageTitle({ eyebrow, title, detail }: { eyebrow?: string; title: string; detail?: string }) {
  const colors = useColors();
  return (
    <View style={styles.pageTitle}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {detail ? <Text style={[styles.detail, { color: colors.mutedForeground }]}>{detail}</Text> : null}
    </View>
  );
}

export function ActionButton({ label, onPress, secondary = false, disabled = false, icon }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean; icon?: keyof typeof Feather.glyphMap }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={`button-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: secondary ? colors.secondary : colors.primary },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      {icon ? <Feather name={icon} size={17} color={secondary ? colors.secondaryForeground : colors.primaryForeground} /> : null}
      <Text style={[styles.buttonText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }, style]}>{children}</View>;
}

export function Metric({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  const colors = useColors();
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}{suffix ? <Text style={[styles.metricSuffix, { color: colors.mutedForeground }]}>{suffix}</Text> : null}</Text>
      <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { gap: 7, marginBottom: 20 },
  eyebrow: { fontSize: 11, letterSpacing: 1.7, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, lineHeight: 35, fontFamily: 'Inter_700Bold' },
  detail: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  card: { borderWidth: 1, padding: 17, marginBottom: 13 },
  button: { minHeight: 51, borderRadius: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  buttonText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.45 },
  metric: { flex: 1, gap: 4 },
  metricValue: { fontSize: 23, fontFamily: 'Inter_700Bold' },
  metricSuffix: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  metricLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
