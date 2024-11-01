/* eslint-disable @typescript-eslint/no-explicit-any */
import { colorBase } from '@__colors/colorBase';
import { ActionButton, Input } from '@__components/ui';
import { InputTextValidProps } from '@__types/ui.type';
import { validateMinLength } from '@__utils/validators';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Modal, TextInput, Text, StyleSheet, View } from 'react-native';

interface IQuestionTextModal {
  openQuestionTextModal: boolean;
  value: string;
  handleOpenQuestionTextModaAction: (action: boolean) => void;
  handleInputQuestionText: (value: string) => void;
}

export const QuestionTextModal: FC<IQuestionTextModal> = ({
  openQuestionTextModal,
  handleOpenQuestionTextModaAction,
  handleInputQuestionText,
  value,
}) => {
  const [inputQuestionValues, setInputQuestionValues] = useState<InputTextValidProps>({
    value: value ? value : '',
    isValid: true,
    isTouched: false,
  });

  const validLengt = 9;

  const handleIpValue = (value: string) => {
    setInputQuestionValues((currentValues) => ({
      ...currentValues,
      isValid: true,
      value,
    }));
  };

  const handleSubmit = () => {
    if (validateMinLength(3)(inputQuestionValues.value)) {
      handleInputQuestionText(inputQuestionValues.value);
      handleOpenQuestionTextModaAction(false);
    } else {
      setInputQuestionValues((currentValues) => ({
        ...currentValues,
        isValid: validateMinLength(validLengt)(inputQuestionValues.value),
      }));
    }
  };

  const handleFocus = () => {
    setInputQuestionValues((currentValues) => {
      return {
        ...currentValues,
        isTouched: true,
      };
    });
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSubmit();
    }
  };

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value !== '') {
      setInputQuestionValues({
        value,
        isValid: true,
        isTouched: false,
      });
    }
    if (openQuestionTextModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openQuestionTextModal, value]);

  return (
    <Modal visible={openQuestionTextModal}>
      <View style={styles.wrapper}>
        <Text style={styles.headingText}>Podaj Pytanie</Text>
        <Input
          ref={inputRef}
          minWidth={850}
          validators={[validateMinLength(validLengt)]}
          isError={!inputQuestionValues.isValid}
          errorText={`Pytanie musi być dłuższe niż ${validLengt} znaów`}
          variant="outlined"
          inputProps={{
            value: inputQuestionValues.value,
            placeholder: 'Dodaj Pytanie',
            style: styles.questionInputText,
            onChangeText: handleIpValue,
            onKeyPress: handleKeyPress,
            onFocus: handleFocus,
            placeholderTextColor: '#666',
            autoFocus: true,
            autoCorrect: false,
          }}
        />
        <View style={styles.wrapperButton}>
          <ActionButton
            onPress={handleOpenQuestionTextModaAction.bind(this, false)}
            title="Anuluj"
            backgroundColor="redDark"
            color="mainGold"
          />
          <ActionButton onPress={handleSubmit} title="Dodaj" color="mainGold" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colorBase.backgroundMain,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  headingText: {
    color: colorBase.whiteDefault,
    fontSize: 24,
  },
  questionInputText: {
    color: colorBase.whiteDefault,
    borderTopColor: colorBase.blueMain,
    fontSize: 24,
    borderWidth: 0,
    padding: 8,
    minWidth: 640,
    borderBottomColor: colorBase.whiteDefault,
    borderBottomWidth: 1,
  },
  wrapperButton: {
    width: 500,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
