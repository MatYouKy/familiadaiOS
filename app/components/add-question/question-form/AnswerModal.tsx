import React, { FC, useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, TextInput } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { ActionButton, Divider } from '@__components/ui';
import { IModalAction } from '@__types/ui.type';
import { FormAnswerType } from './QuestionFormModal';
import { Input } from '../../../../components/ui/Input/Input';

interface IAnswerModal {
  editMode?: boolean;
  modalAction: IModalAction;
  answer: FormAnswerType;
  answerHandler?: () => void;
  handleInputText: (inputIdentifier: string, value: string) => void;
  handleUpdateAnswer?: (updateAnswer: FormAnswerType) => void;
}

export const AnswerModal: FC<IAnswerModal> = ({
  modalAction,
  answerHandler,
  handleInputText,
  answer,
  handleUpdateAnswer,
  editMode = false,
}) => {
  const { isOpen, onClose } = modalAction;
  const inputRef = useRef<TextInput>(null);
  const minTextLength = 3;

  const [isError, setIsError] = useState<boolean>(false);
  const [isScoreError, setIsScoreError] = useState<boolean>(false);
  const [scoreErrorText, setScoreErrorText] = useState<string>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleTextChange = (inputIdentifier: string, text: string) => {
    if (inputIdentifier === 'score') {
      if (!/^\d*$/.test(text)) {
        // Akceptuje tylko cyfry
        setIsScoreError(true);
        setScoreErrorText('W polu punktacji można wprowadzić tylko cyfry od 1 do 50.');
        return;
      }
    }

    handleInputText(inputIdentifier, text);

    if (inputIdentifier === 'text') {
      if (isFirstTime && text.length >= minTextLength) {
        setIsFirstTime(false);
      }
      if (!isFirstTime) {
        setIsError(text.length < minTextLength || text.trim() === '');
      }
    } else if (inputIdentifier === 'score') {
      const score = parseInt(text, 10);
      if (isNaN(score) || score <= 0 || score > 50) {
        setIsScoreError(true);
        setScoreErrorText('Punktacja musi być liczbą od 1 do 50.');
      } else {
        setIsScoreError(false);
        setScoreErrorText('');
      }
    }
  };

  const isFormInvalid =
    isError ||
    isScoreError ||
    answer.text.trim() === '' ||
    isNaN(parseInt(answer.score, 10)) ||
    parseInt(answer.score, 10) <= 0 ||
    parseInt(answer.score, 10) > 50;

  return (
    <Modal visible={isOpen} animationType="fade">
      <View style={styles.editModalWrapper}>
        <View style={styles.inputContainer}>
          <Input
            ref={inputRef}
            label="Zmień odpowiedź"
            inputProps={{
              placeholder: 'Wpisz odpowiedź',
              onChangeText: (text) => handleTextChange('text', text),
              value: answer.text,
            }}
            isError={isError}
            errorText={`Odpowiedź musi mieć co najmniej ${minTextLength} znaki.`}
          />
          <Input
            label="Podaj punktacje"
            inputProps={{
              maxLength: 2,
              keyboardType: 'number-pad',
              onChangeText: (text) => handleTextChange('score', text),
              value: answer.score,
            }}
            isError={isScoreError}
            errorText={scoreErrorText}
          />
          <Divider color="bluePastel" />
          <View style={styles.buttonsWrapper}>
            <ActionButton
              onPress={onClose}
              title="Anuluj"
              size="x-small"
              color="blueDark"
            />
            <ActionButton
              onPress={
                editMode && handleUpdateAnswer
                  ? handleUpdateAnswer.bind(this, answer)
                  : answerHandler
              }
              title={editMode ? 'Zmień' : 'Dodaj'}
              size="x-small"
              color="blueDark"
              disabled={isFormInvalid}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  editModalWrapper: {
    backgroundColor: colorBase.backgroundMain,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    minWidth: '60%',
    padding: 48,
    borderWidth: 2,
    borderColor: colorBase.blueMain,
    borderRadius: 24,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
