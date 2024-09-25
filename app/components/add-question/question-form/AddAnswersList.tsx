import { colorBase } from '@__colors/colorBase';
import { ActionButton, Divider } from '@__components/ui';
import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { FormAnswerType } from './QuestionFormModal';
import { IAnswer } from '@__types/game.type';
import { ActionBar } from '@__components/actions/ActionBar';
import { CustomModal } from 'app/components/game/board/modal/CustomModal';

interface IAddAnswersList {
  answers: IAnswer[];
  addAnswerValue: FormAnswerType;
  handleChangeAnswerText: (inputIdentifier: string, value: string) => void;
  handleNewAnswerText: () => void;
  handleEditAnswer: (id: string) => void;
  handleRemoveAnswer: (id: string) => void;
}

export const AddAnswersList: FC<IAddAnswersList> = ({
  answers,
  handleChangeAnswerText,
  handleNewAnswerText,
  addAnswerValue,
  handleEditAnswer,
  handleRemoveAnswer,
}) => {
  const [addNewAnswer, setAddNewAnswer] = useState(false);
  const [removeWarringModal, setRemoveWarringModal] = useState(false);

  const handleOpenAddNewAnswer = (action: boolean) => {
    setAddNewAnswer(action);
  };

  const handleAddNewAnswer = () => {
    handleNewAnswerText();
    handleOpenAddNewAnswer.bind(this, false);
  };

  const handleRemoveWarringModal = (action: boolean) => {
    setRemoveWarringModal(action);
  };

  return (
    <View>
      <FlatList
        style={styles.list}
        keyExtractor={(item) => {
          return item.id as string;
        }}
        data={answers}
        renderItem={(answer) => {
          return (
            <View style={styles.answerItem}>
              <View style={styles.answerDetails}>
                <Text style={styles.answerIndex}>{answer.index + 1}.</Text>
                <Text style={styles.answerItemText}>{answer.item.text}</Text>
                <View style={styles.actionButtons}>
                  <ActionBar
                    size="small"
                    handleEditItem={handleEditAnswer.bind(this, answer.item.id)}
                    handleRemoveItem={handleRemoveWarringModal.bind(this, true)}
                  />
                  <Text style={styles.answerItemScore}>{answer.item.score}</Text>
                </View>
              </View>
              <Divider color="bluePastel" fullwidth />
              {removeWarringModal && (
                <CustomModal
                  warringModal
                  openModal={removeWarringModal}
                  leftButtonOnPress={handleRemoveAnswer.bind(this, answer.item.id)}
                  rigntButtonOnPress={handleRemoveWarringModal.bind(this, false)}
                  modalText={`Czy jesteś pewien, że chcesz usunąć odpowierdź "${answer.item.text}"?`}
                  leftButtonLabel="usuń"
                  rigntButtonLabel="anuluj"
                />
              )}
            </View>
          );
        }}
      />
      {addNewAnswer && answers.length < 6 && (
        <>
          <View style={styles.InputWrapper}>
            <TextInput
              value={addAnswerValue.text}
              placeholder="Dodaj Pytanie"
              style={styles.questionInputText}
              onChangeText={handleChangeAnswerText.bind(this, 'text')}
              placeholderTextColor="#666"
            />
            <TextInput
              keyboardType="number-pad"
              value={addAnswerValue.score}
              placeholder="0"
              style={styles.scoreInputTextValue}
              onChangeText={handleChangeAnswerText.bind(this, 'score')}
              placeholderTextColor="#666"
            />
          </View>
          <ActionButton
            onPress={handleAddNewAnswer}
            title="Dodaj Odpowiedź"
            color="mainGold"
            size="x-small"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  questionInputText: {
    flex: 1,
    color: colorBase.whiteDefault,
    fontSize: 24,
  },
  answerItem: {
    flexDirection: 'column',
  },
  answerIndex: {
    color: colorBase.whiteDefault,
    fontStyle: 'italic',
    fontSize: 24,
    width: 42,
  },
  answerItemText: {
    color: colorBase.whiteDefault,
    fontStyle: 'italic',
    fontSize: 24,
    flex: 1,
  },
  answerItemScore: {
    color: colorBase.whiteDefault,
    fontStyle: 'italic',
    fontSize: 24,
    width: 50,
  },
  scoreInputTextValue: {
    textAlign: 'center',
    width: 100,
    color: colorBase.whiteDefault,
    fontSize: 24,
  },
  addNewAnswer: {
    marginVertical: 24,
  },
  answerDetails: {
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  InputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    marginVertical: 24,
  },
  verticalSeparator: {
    width: 2,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: colorBase.bluePastel,
  },
});
