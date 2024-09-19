export const colorBase = {
  mainGold: '#d3a211',
  white: {
    default: '#fff',
    shadow: '#ffffff44'
  },
  background: {
    main: '#343434',
    dark: '#222222',
    light: '#999999',
  },
  blue: {
    light: '#1188ff',
    pastel: '#4fc3f7',
    main: '#29b6f6',
    default: '#2476ff',
    dark: '#0288d1',
  },
  red: {
    default: '#dd0000',
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    shadow: '#dd000066',
  },
  black: '#000000',
  success: {
    main: '#66bb6a',
    light: '#81c784',
    dark: '#388e3c',
  },
  transparent: '#00000000',
  none: 'none'
} as const;

export type ColorAliases =
  | 'mainGold'
  | 'white'
  | 'white-shadow'
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
  white: colorBase.white.default,
  'white-shadow': colorBase.white.shadow,
  backgroundMain: colorBase.background.main,
  backgroundDark: colorBase.background.dark,
  backgroundLight: colorBase.background.light,
  blueLight: colorBase.blue.light,
  bluePastel: colorBase.blue.pastel,
  blueMain: colorBase.blue.main,
  blueDefault: colorBase.blue.default,
  blueDark: colorBase.blue.dark,
  redDefault: colorBase.red.default,
  redLight: colorBase.red.light,
  redMain: colorBase.red.main,
  redDark: colorBase.red.dark,
  redShadow: colorBase.red.shadow,
  black: colorBase.black,
  successMain: colorBase.success.main,
  successLight: colorBase.success.light,
  successDark: colorBase.success.dark,
  transparent: colorBase.transparent,
  none: colorBase.none,
};
