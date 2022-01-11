import {
  backgroundColorCode,
  colorCode,
  textColorCode,
} from '@allthings/elements/utils/propTypes/color'

const themes = {
  dark: {
    background: backgroundColorCode('bright'),
    contrast: colorCode('white'),
    disabled: colorCode('grey'),
    notificationIndicator: colorCode('red'),
    primary: colorCode('lightBlack'),
    secondaryText: textColorCode('secondary'),
    text: textColorCode('primary'),
    textOnBackground: colorCode('white'),
    titleColor: colorCode('grey'),
  },
  demo: {
    background: backgroundColorCode('bright'),
    contrast: colorCode('white'),
    disabled: colorCode('grey'),
    notificationIndicator: colorCode('redIntense'),
    primary: colorCode('red'),
    secondaryText: textColorCode('secondary'),
    text: textColorCode('primary'),
    textOnBackground: colorCode('white'),
    titleColor: colorCode('grey'),
  },
  pale: {
    background: backgroundColorCode('bright'),
    contrast: colorCode('lightBlack'),
    disabled: colorCode('grey'),
    notificationIndicator: colorCode('red'),
    primary: colorCode('white'),
    secondaryText: textColorCode('secondary'),
    text: textColorCode('primary'),
    textOnBackground: colorCode('white'),
    titleColor: colorCode('grey'),
  },
}

export const getTheme = (name: string) => themes[name]
