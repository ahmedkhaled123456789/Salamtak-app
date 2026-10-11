import { Platform, type ViewStyle } from 'react-native';

/** `shadow-soft` / `shadow-lift` from the website, as iOS shadow props + Android elevation. */
const make = (offsetY: number, radius: number, opacity: number, elevation: number): ViewStyle =>
  Platform.select<ViewStyle>({
    android: { elevation },
    web: { boxShadow: `0 ${offsetY}px ${radius * 2}px -${radius / 2}px rgba(23,43,42,${opacity})` } as ViewStyle,
    default: {
      shadowColor: '#172B2A',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  }) ?? {};

export const shadows = {
  none: {} as ViewStyle,
  soft: make(6, 14, 0.12, 2),
  lift: make(14, 26, 0.22, 8),
  brand: make(6, 10, 0.35, 4),
};
