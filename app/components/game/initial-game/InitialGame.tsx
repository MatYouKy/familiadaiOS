import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { ICompetition } from '@__types/game.type';
import { Divider, ActionButton } from '@__components/ui';
import { GameList } from './GameList';
import { uuid } from '@__utils/idGenerator';
import useFetchData from '@__hooks/useFetchData';
import { useAppSelector } from '@__store/hooks';
import { MenageCompetitionModal } from '../../add-competition/MenageCompetitionModal';

const InitialGame = () => {
  const initialCompetition: ICompetition = {
    competitionTitle: '',
    eventDate: '',
    id: uuid(),
    questions: [],
  };
  const [newCompetitions, setNewCompetitions] =
    useState<ICompetition>(initialCompetition);
  const [addQuestionModal, setAddQuestionModal] = useState(false);

  const connectState = useAppSelector((state) => state.webSocketSlice.status);

  const { getData, isLoading } = useFetchData();

  useEffect(() => {
    if (connectState === 'success') {
      getData();
    }
  }, [connectState]);

  const handleModalAction = (action: boolean) => {
    setNewCompetitions({
      ...initialCompetition,
      id: uuid(),
    });
    setAddQuestionModal(action);
  };

  return (
    <View style={styles.initialGameContainer}>
      <View style={styles.buttonWrapper}>
        <View>
          <ActionButton
            title="Dodaj Nowe Pytanie"
            onPress={handleModalAction.bind(this, true)}
            size="x-small"
            color="whiteDefault"
            backgroundColor="successLight"
          />
        </View>
        <ActionButton
          title="Zaktualizuj listę pytań"
          onPress={getData}
          size="x-small"
          color="whiteDefault"
          backgroundColor="blueDefault"
        />
      </View>
      <Divider />
      <View style={styles.gameListWrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colorBase.mainGold} />
        ) : (
          <GameList />
        )}
      </View>
      {addQuestionModal && (
        <MenageCompetitionModal
          addQuestionModal={addQuestionModal}
          closeModal={handleModalAction.bind(this, false)}
          initialCompetition={newCompetitions}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  initialGameContainer: {
    paddingTop: 48,
    flex: 1,
    backgroundColor: colorBase.backgroundDark,
    width: '100%',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 184,
    padding: 48,
  },
  gameListWrapper: {
    width: '80%',
    marginHorizontal: 'auto',
    flex: 7,
  },
});

export default React.memo(InitialGame);
