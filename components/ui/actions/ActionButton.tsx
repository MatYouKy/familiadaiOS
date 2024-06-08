import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { ColorAliases, colorMap } from '../../../colors/colorBase';

export type FontSizeAliases =
  | 'x-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'x-large';

const fontSizeMap: Record<FontSizeAliases, number> = {
  'x-small': 12,
  small: 14,
  medium: 16,
  large: 18,
  'x-large': 20,
};

interface IActionButton {
  onPress: () => void;
  title: string;
  variant?: 'OUTLINED' | 'SMALL' | 'DEFAULT';
  backgroundColor?: ColorAliases;
  color?: ColorAliases;
  size?: FontSizeAliases;
  fullwidth?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const ActionButton: FC<IActionButton> = ({
  onPress,
  title,
  backgroundColor = 'white',
  color = 'black',
  // variant = 'DEFAULT',
  size = 'medium',
  fullwidth = false,
  buttonStyle,
  textStyle,
}) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: colorMap[backgroundColor] },
          fullwidth && { width: '100%' },
          buttonStyle as ViewStyle,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colorMap[color], fontSize: fontSizeMap[size] },
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
    marginHorizontal: 'auto',
    borderRadius: 36,
  },
  buttonText: {
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontWeight: '700',
  },
});
