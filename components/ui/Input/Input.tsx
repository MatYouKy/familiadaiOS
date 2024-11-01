import { ColorAliases, colorBase, colorMap } from '@__colors/colorBase';
import { SizeAliases } from '@__types/ui.type';
import { hexToRgba } from '@__utils/hexToRGBA';
import { sizeMap } from '@__utils/sizeMap';
import React, { forwardRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';

interface IInput {
  validators?: [(ipAddress: string) => boolean]
  minWidth?: ViewStyle['minWidth'];
  size?: SizeAliases;
  label?: string;
  inputProps?: TextInputProps;
  errorText?: string | null;
  isError?: boolean;
  colorVariant?: ColorAliases;
  direction?: 'row' | 'column';
  variant?: 'default' | 'underline' | 'outlined' | 'shadow';
}

export const Input = forwardRef<TextInput, IInput>(
  (
    {
      label,
      errorText = '',
      isError,
      colorVariant = 'whiteDefault',
      direction = 'column',
      size = 'medium',
      variant,
      inputProps,
      minWidth,
    },
    ref
  ) => {
    let propsStyle = {
      ...styles.inputWrapper,
      padding: 0.8 * sizeMap[size],
      gap: 0.2 * sizeMap[size],
    } as ViewStyle;
    let inputPropsStyle = {
      ...styles.input,
      minWidth,
      fontSize: sizeMap[size],
      color: colorMap[colorVariant],
      borderColor: isError ? colorBase.redDefault : colorMap[colorVariant],
      cursor: 'pointer',
    } as ViewStyle;

    const placeholderTextColor =
      colorVariant &&
      (hexToRgba(colorBase[colorVariant], 0.3));

    const cursorColor =
      colorVariant === 'whiteShadow' ? colorBase.whiteShadow : colorBase[colorVariant];

    switch (direction) {
      case 'column':
        propsStyle = {
          ...propsStyle,
          flexDirection: 'column',
        };
        break;
      case 'row':
        propsStyle = {
          ...propsStyle,
          flexDirection: 'row',
          alignItems: 'center',
        };
        break;
      default:
        break;
    }

    switch (variant) {
      case 'outlined':
        inputPropsStyle = {
          ...inputPropsStyle,
          borderWidth: 1,
        };
        break;
      case 'underline':
        inputPropsStyle = {
          ...inputPropsStyle,
          borderBottomWidth: 1,
        };
        break;
      case 'shadow':
        inputPropsStyle = {
          ...inputPropsStyle,
          backgroundColor: colorBase.backgroundLight,
        };
        break;
      default:
        break;
    }

    return (
      <View style={propsStyle}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View>
          <TextInput
            ref={ref}
            placeholderTextColor={placeholderTextColor}
            cursorColor={cursorColor}
            {...inputProps}
            style={inputPropsStyle}
          />
          <View style={{ height: sizeMap[size] }}>
            {isError && <Text style={styles.errorText}>{errorText}</Text>}
          </View>
        </View>
      </View>
    );
  }
);
Input.displayName = 'Input';

const styles = StyleSheet.create({
  inputWrapper: {
    gap: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    fontSize: 16,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  label: {
    // marginBottom: 24,
    color: colorBase.whiteDefault,
    fontSize: 20,
    marginLeft: 8,
  },
  inputError: {
    borderColor: colorBase.redDefault,
    borderWidth: 1,
  },
  errorText: {
    color: colorBase.redDefault,
    marginLeft: 48,
    marginTop: 4,
    padding: 4,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
});
