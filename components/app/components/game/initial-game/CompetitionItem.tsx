import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { ICompetition } from '@__types/game.type';
import { QuestionModal } from './QuestionModal';
import { useAppDispatch } from '@__store/hooks';
import { startGame, updateGameProgress } from '@__store/slices/globalStateReducer';
import { startGameTeam } from '@__store/slices/teamsState';
import { ActionBar } from '@__components/actions/ActionBar';
import { IconButton } from '@__components/ui/actions/iconButtons/IconButton';
import useFetchData from '@__hooks/useFetchData';
import { CustomModal } from '../board/modal/CustomModal';
import { startCompetitionFunc } from '@__store/slices/gameState';
import { MenageCompetitionModal } from '../../add-competition/MenageCompetitionModal';

interface ICompetitionItem {
  competition: ICompetition;
}
export const CompetitionItem: FC<ICompetitionItem> = ({ competition }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [removeWarringModal, setRemoveWarringModal] = useState(false);
  const { deleteData } = useFetchData();

  const dispatch = useAppDispatch();

  const handleEditModal = (action: boolean) => {
    setEditModal(action);
  };

  const handleRemoveWarringModal = (action: boolean) => {
    setRemoveWarringModal(action);
  };

  const openModal = () => {
    setShowAnswers((prew) => !prew);
  };
  const closeModal = () => {
    setShowAnswers((prew) => !prew);
  };

  const addQuestionForGame = () => {
    closeModal();
    dispatch(startGame(competition.questions));
    dispatch(startGameTeam());
    dispatch(updateGameProgress('START'));
    dispatch(startCompetitionFunc(true));

  };

  const answersList = competition.questions.map((answer) => {
    return (
      <View key={answer.question} style={styles.listItem}>
        <Text>{answer.question}</Text>
      </View>
    );
  });

  return (
    <View style={styles.listItem}>
      <IconButton
        onPress={addQuestionForGame}
        action="PLAY"
        color="successMain"
        size="x-large"
      />
      <Text style={styles.listItemText}>{competition.eventDate}</Text>
      <Text style={{ ...styles.listItemText, flex: 1 }}>
        {competition.competitionTitle}
      </Text>
      <View style={styles.buttonsWrapper}>
        <IconButton
          onPress={openModal}
          action="INFO"
          color="mainGold"
          size="medium"
          buttonStyle={{ marginHorizontal: 50 }}
        />
        <ActionBar
          handleEditItem={handleEditModal.bind(this, true)}
          handleRemoveItem={handleRemoveWarringModal.bind(this, true)}
          separatorColor="mainGold"
        />
      </View>
      {showAnswers && answersList}
      <QuestionModal
        isOpen={showAnswers}
        closeModal={closeModal}
        competition={competition}
      />
      {removeWarringModal && (
        <CustomModal
          warringModal
          openModal={removeWarringModal}
          leftButtonOnPress={deleteData.bind(this, competition.id)}
          rigntButtonOnPress={handleRemoveWarringModal.bind(this, false)}
          modalText={`Czy jesteś pewien, że chcesz usunąć wydarzenie ${competition.competitionTitle}?`}
          leftButtonLabel="usuń"
          rigntButtonLabel="anuluj"
        />
      )}
      {editModal && (
        <MenageCompetitionModal
          editMode
          addQuestionModal={editModal}
          closeModal={handleEditModal.bind(this, false)}
          initialCompetition={competition}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 14,
  },
  listItemText: {
    color: colorBase.white.default,
  },
  showButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonsWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
