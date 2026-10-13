import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = { tablet: 640, desktop: 1024 } as const;

/** Responsive helpers driven by the current window width (web resize, tablet rotation). */
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isTablet: width >= BREAKPOINTS.tablet,
    isDesktop: width >= BREAKPOINTS.desktop,
  };
}
