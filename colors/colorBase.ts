export const colorBase = {
  mainGold: '#d3a211',
  whiteDefault: '#fff',
  whiteShadow: '#ffffff44',
  backgroundMain: '#343434',
  backgroundDark: '#222222',
  backgroundLight: '#999999', 
  blueLight: '#1188ff',
  bluePastel: '#4fc3f7',
  blueMain: '#29b6f6',
  blueDefault: '#2476ff',
  blueDark: '#0288d1',
  redDefault: '#dd0000',
  redLight: '#e57373',
  redMain: '#f44336',
  redDark: '#d32f2f',
  redShadow: '#dd000066',
  black: '#000000',
  successMain: '#66bb6a',
  successLight: '#81c784',
  successDark: '#388e3c',
  transparent: '#00000000',
  none: 'none',
} as const;

export type ColorAliases =
  | 'mainGold'
  | 'whiteDefault'
  | 'whiteShadow'
  | 'backgroundMain'
  | 'backgroundDark'
  | 'backgroundLight'
  | 'blueLight'
  | 'bluePastel'
  | 'blueMain'
  | 'blueDefault'
  | 'blueDark'
  | 'redDefault'
  | 'redLight'
  | 'redMain'
  | 'redDark'
  | 'redShadow'
  | 'black'
  | 'successMain'
  | 'successLight'
  | 'successDark'
  | 'none'
  | 'transparent';

export const colorMap: Record<ColorAliases, string> = {
  mainGold: colorBase.mainGold,
  whiteDefault: colorBase.whiteDefault,
  whiteShadow: colorBase.whiteShadow,
  backgroundMain: colorBase.backgroundMain,
  backgroundDark: colorBase.backgroundDark,
  backgroundLight: colorBase.backgroundLight,
  blueLight: colorBase.blueLight,
  bluePastel: colorBase.bluePastel,
  blueMain: colorBase.blueMain,
  blueDefault: colorBase.blueDefault,
  blueDark: colorBase.blueDark,
  redDefault: colorBase.redDefault,
  redLight: colorBase.redLight,
  redMain: colorBase.redMain,
  redDark: colorBase.redDark,
  redShadow: colorBase.redShadow,
  black: colorBase.black,
  successMain: colorBase.successMain,
  successLight: colorBase.successLight,
  successDark: colorBase.successDark,
  transparent: colorBase.transparent,
  none: colorBase.none,
};
