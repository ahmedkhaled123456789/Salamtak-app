/** Values copied from website/tailwind.config.js — do not invent new brand colours here. */
export const colors = {
  brand: '#0F766E',
  brandDark: '#115E59',
  brandDeep: '#0B3F3B',
  mint: '#DDF5EC',
  mintSoft: '#EEF9F4',
  ivory: '#FAFAF7',
  ink: '#172B2A',
  muted: '#5F706E', // AA contrast (≥4.5:1) on ivory, white and mint; was #6B7C7A
  line: '#E5ECE9',
  lineStrong: '#CFDCD7',
  coral: '#D9694A',
  coralSoft: '#FCEDE7',
  coralText: '#9A3B22',
  amberSoft: '#FDF3DC',
  amberText: '#7A5310',
  neutralSoft: '#EEF2F0',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export type ColorName = keyof typeof colors;
