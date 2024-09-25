import React, { FC } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { ColorAliases, colorBase, colorMap } from '@__colors/colorBase';
import { hexToRgba } from '@__utils/hexToRGBA';

export type FontSizeAliases = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';

const fontSizeMap: Record<FontSizeAliases, number> = {
  'x-small': 12,
  small: 14,
  medium: 16,
  large: 18,
  'x-large': 20,
};

interface IActionButton {
  onPress: PressableProps['onPress'];
  title: string;
  variant?: 'OUTLINED' | 'SMALL' | 'DEFAULT';
  backgroundColor?: ColorAliases;
  color?: ColorAliases;
  size?: FontSizeAliases;
  fullwidth?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const ActionButton: FC<IActionButton> = ({
  onPress,
  title,
  backgroundColor = 'backgroundMain',
  color = "whiteDefault",
  // variant = 'DEFAULT',
  size = 'medium',
  fullwidth = false,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[fullwidth && { width: '100%' }]}
    >
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: disabled
              ? hexToRgba(colorBase[backgroundColor], 0.3)
              : colorMap[backgroundColor],
          },
          buttonStyle as ViewStyle,
          disabled && styles.disabledButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: disabled ? colorMap[color] : colorMap[color],
              fontSize: fontSizeMap[size],
            },
            {
              paddingHorizontal: 2 * fontSizeMap[size],
              paddingVertical: fontSizeMap[size],
            },
            textStyle as TextStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'capitalize'
  },
  disabledButton: {
    opacity: 0.2,
  },
});
