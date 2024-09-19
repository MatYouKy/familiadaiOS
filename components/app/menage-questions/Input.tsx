import { colorBase } from '@__colors/colorBase';
import React, { forwardRef } from 'react';
import { View, StyleSheet, Text, TextInput, TextInputProps } from 'react-native';

interface IInput {
  label: string;
  inputProps?: TextInputProps;
  errorText?: string;
  isError?: boolean;
}

export const Input = forwardRef<TextInput, IInput>(
  ({ label, errorText, isError, inputProps }, ref) => {
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          {...inputProps}
          style={[styles.input, isError ? styles.inputError : null]}
        />
        {isError && <Text style={styles.errorText}>{errorText}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  inputWrapper: {
    marginHorizontal: 4,
    marginVertical: 16,
  },
  input: {
    backgroundColor: colorBase.background.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    fontSize: 16,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  label: {
    marginBottom: 24,
    color: colorBase.white.default,
    fontSize: 20,
    marginLeft: 8,
  },
  inputError: {
    borderColor: colorBase.red.default,
    borderWidth: 1,
  },
  errorText: {
    color: colorBase.red.default,
    marginLeft: 8,
    marginTop: 4,
  },
});
