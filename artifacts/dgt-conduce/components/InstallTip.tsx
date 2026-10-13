import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

const DISMISS_KEY = 'conduce-install-tip-dismissed';

type InstallEvent = Event & { prompt: () => Promise<void> };

/** Web only: invites phone users to add the app to their home screen so it opens like a normal app, offline too. */
export function InstallTip() {
  const colors = useColors();
  const [kind, setKind] = useState<'ios' | 'android' | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const deferred = useRef<InstallEvent | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
    } catch {}
    const ua = navigator.userAgent;
    if (standalone || dismissed || !/iphone|ipad|ipod|android/i.test(ua)) return;
    setKind(/iphone|ipad|ipod/i.test(ua) ? 'ios' : 'android');
    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferred.current = event as InstallEvent;
      setCanPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!kind) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
    setKind(null);
  };
  const install = async () => {
    await deferred.current?.prompt();
    dismiss();
  };

  return (
    <View style={[styles.tip, { backgroundColor: colors.accent }]} accessibilityRole="alert">
      <Feather name="smartphone" size={20} color={colors.accentForeground} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.accentForeground }]}>Ten la app siempre a mano</Text>
        <Text style={[styles.text, { color: colors.accentForeground }]}>
          {kind === 'ios'
            ? 'En Safari pulsa Compartir y luego «Añadir a pantalla de inicio». Se abrirá como una app y funcionará sin conexión.'
            : canPrompt
              ? 'Instálala en tu móvil: se abrirá como una app y funcionará sin conexión.'
              : 'En el menú del navegador (⋮) elige «Instalar aplicación» o «Añadir a pantalla de inicio».'}
        </Text>
        {canPrompt ? (
          <Pressable onPress={install} accessibilityRole="button" style={[styles.button, { backgroundColor: colors.accentForeground }]} testID="install-app">
            <Text style={[styles.buttonText, { color: colors.accent }]}>Instalar</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable onPress={dismiss} accessibilityRole="button" accessibilityLabel="Cerrar aviso" hitSlop={10} testID="dismiss-install-tip">
        <Feather name="x" size={18} color={colors.accentForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 18, padding: 14, marginBottom: 20 },
  copy: { flex: 1, gap: 4 },
  title: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  text: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium' },
  button: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginTop: 8 },
  buttonText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
});
