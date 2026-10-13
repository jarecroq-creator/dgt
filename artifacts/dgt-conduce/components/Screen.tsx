import React, { ReactNode } from 'react';
import { Platform, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const isWeb = Platform.OS === 'web';

/** Centered column: full width on phones, capped width on tablets and desktops. */
export function Column({ children, maxWidth = 960, style }: { children: ReactNode; maxWidth?: number; style?: StyleProp<ViewStyle> }) {
  const { isTablet } = useBreakpoint();
  return <View style={[{ width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: isTablet ? 32 : 20 }, style]}>{children}</View>;
}

/** Scrollable page whose content stays readable on any window width. */
export function ScreenScroll({ children, maxWidth = 960, topPadding = 22, bottomPadding = 120 }: { children: ReactNode; maxWidth?: number; topPadding?: number; bottomPadding?: number }) {
  const colors = useColors();
  const { isTablet } = useBreakpoint();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: isWeb ? (isTablet ? 44 : 28) : topPadding, paddingBottom: isWeb ? 48 : bottomPadding }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Column maxWidth={maxWidth}>{children}</Column>
    </ScrollView>
  );
}

/** Lays children out in 1 column on phones and `columns` columns on wider screens. */
export function Grid({ children, columns = 2, gap = 12 }: { children: ReactNode; columns?: number; gap?: number }) {
  const { isTablet } = useBreakpoint();
  const cols = isTablet ? columns : 1;
  const items = React.Children.toArray(children);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: gap }}>
      {items.map((child, index) => (
        <View key={index} style={{ width: cols === 1 ? '100%' : cols === 2 ? '48.8%' : '32%' }}>
          {child}
        </View>
      ))}
    </View>
  );
}
