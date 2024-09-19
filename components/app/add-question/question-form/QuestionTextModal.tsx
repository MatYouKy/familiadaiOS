/* eslint-disable @typescript-eslint/no-explicit-any */
import { colorBase } from '@__colors/colorBase';
import { ActionButton } from '@__components/ui';
import React, { FC, useEffect, useRef } from 'react';
import { Modal, TextInput, Text, StyleSheet, View } from 'react-native';

interface IQuestionTextModal {
  openQuestionTextModal: boolean;
  value: string;
  handleOpenQuestionTextModaAction: (action: boolean) => void;
  handleChangeQuestionText: (value: string) => void;
}

export const QuestionTextModal: FC<IQuestionTextModal> = ({
  openQuestionTextModal,
  handleOpenQuestionTextModaAction,
  handleChangeQuestionText,
  value,
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (openQuestionTextModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openQuestionTextModal]);

  return (
    <Modal visible={openQuestionTextModal}>
      <View style={styles.wrapper}>
        <Text style={styles.headingText}>Podaj Pytanie</Text>
        <TextInput
          ref={inputRef}
          value={value}
          placeholder="Dodaj Pytanie"
          style={styles.questionInputText}
          onChangeText={handleChangeQuestionText}
          placeholderTextColor="#666"
        />

        {value.length > 3 && (
          <ActionButton
            onPress={handleOpenQuestionTextModaAction.bind(this, false)}
            title="Dodaj"
            color="mainGold"
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colorBase.background.main,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  headingText: {
    color: colorBase.white.default,
    fontSize: 24,
  },
  questionInputText: {
    color: colorBase.white.default,
    borderTopColor: colorBase.blue.main,
    fontSize: 24,
    borderWidth: 0,
    padding: 8,
    minWidth: 640,
    borderBottomColor: colorBase.blue.default,
    borderBottomWidth: 1,
  }
});
