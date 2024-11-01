import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ITeam } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import { MissedButton } from './sections/MissedButton';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  blueFaultButtonDisabledFunc,
  blueTeamActive,
  clearFaultFunc,
  redFaultButtonDisabledFunc,
  redTeamActive,
  updateBlueTotalScore,
  updateRedTotalScore,
} from '@__store/slices/teamsState';
import { updateSession } from '@__store/slices/globalStateReducer';
import {
  boardBlockedFunc,
  showEndGameButtonFunc,
  showNextRoundButtonFunc,
  updateGameScore,
  updateGameStatus,
} from '@__store/slices/gameState';
import { CollectButton } from './sections/CollectButton';
import { ActiveButton } from './sections/ActiveButton';
import { NameModal } from './sections/NameModal';
import FaultCounter from './sections/FaultCounter';
import checkAnswerVisibility from '@__utils/checksAnswer';

interface IGameTeam {
  teamData: ITeam;
}

export const GameTeam: FC<IGameTeam> = ({ teamData }) => {
  const { teamType, fault, name, totalScore, activeButton, collectButton } = teamData;
  const dispatch = useAppDispatch();

  const redIsActive = useAppSelector((state) => state.teams.redTeam.stationActive);
  const blueIsActive = useAppSelector((state) => state.teams.blueTeam.stationActive);

  const { score, gameStatus, roundNumber, currentQuestion } = useAppSelector(
    (state) => state.gameState
  );

  const {
    allVisible,
  } = checkAnswerVisibility(currentQuestion.answers);
  const { questions } = useAppSelector((state) => state.globalState);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openChangeNameModal = (open: boolean) => {
    setModalIsOpen(open);
  };

  const handleCollectScore = () => {
    dispatch(updateGameScore(0));
    dispatch(boardBlockedFunc(false));

    if (teamType === 'BLUE') {
      dispatch(updateBlueTotalScore(score));
    } else {
      dispatch(updateRedTotalScore(score));
    }
    if (allVisible) {
      if (roundNumber < questions.length - 1) {
        dispatch(showNextRoundButtonFunc(true));
      } else {
        dispatch(showEndGameButtonFunc(true));
      }
    }
    dispatch(updateGameStatus('SUMMARY-GAME'));
  };

  const handleIsActive = () => {
    dispatch(clearFaultFunc());
    dispatch(updateSession(true));
    dispatch(updateGameStatus('GAME'));
    dispatch(boardBlockedFunc(false));
    if (teamType === 'BLUE') {
      dispatch(blueTeamActive(true));
      dispatch(blueFaultButtonDisabledFunc(false));
    } else {
      dispatch(redTeamActive(true));
      dispatch(redFaultButtonDisabledFunc(false));
    }
  };

  const teamVarriable =
    teamType === 'BLUE'
      ? {
          color: colorBase.blueDefault,
          hoverColor: colorBase.whiteDefault,
          heading: 'Zmień nazwę drużyny Niebieskiej!',
        }
      : {
          color: colorBase.redDefault,
          hoverColor: colorBase.redShadow,
          heading: 'Zmień nazwę drużyny Czerwonej!',
        };

  const teamBackgroundColor =
    teamType === 'BLUE'
      ? blueIsActive
        ? colorBase.blueDefault
        : colorBase.backgroundDark
      : redIsActive
        ? colorBase.redShadow
        : colorBase.backgroundDark;

  const shouldBeActive =
    (teamData.isActive && teamData.fault.length < 3) ||
    (teamData.extraGame && teamData.fault.length === 0);

  const shouldShowMissedButton = gameStatus === 'BATTLE';

  return (
    <View style={styles.container}>
      {modalIsOpen && (
        <NameModal
          isOpen={modalIsOpen}
          closeModal={openChangeNameModal}
          teamType={teamType}
        />
      )}
      <View style={styles.name}>
        <Pressable onPress={openChangeNameModal.bind(this, true)}>
          <Text style={{ ...styles.nameText, color: teamVarriable.color }}>{name}</Text>
        </Pressable>
      </View>
      <View
        style={{
          ...styles.actionWrapper,
          backgroundColor: teamBackgroundColor,
        }}
      >
        <FaultCounter fault={fault} />
        {collectButton && gameStatus !== 'SUMMARY-GAME' && (
          <View style={styles.teamAction}>
            <CollectButton teamType={teamType} handleCollectScore={handleCollectScore} />
          </View>
        )}

        {activeButton && (gameStatus === 'BATTLE' || gameStatus === 'BOARD-BLOCKED') && (
          <View style={styles.teamAction}>
            <ActiveButton handleIsActive={handleIsActive} teamType={teamType} />
          </View>
        )}
        <View>
          {(shouldBeActive || shouldShowMissedButton) && (
            <MissedButton teamType={teamType} />
          )}
        </View>
      </View>
      <View style={styles.score}>
        <Text style={styles.scoreText}>{totalScore}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colorBase.backgroundDark,
  },
  actionWrapper: {
    backgroundColor: colorBase.backgroundDark,
    flex: 1,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  score: {
    borderTopWidth: 2,
    borderTopColor: colorBase.mainGold,
    height: 120,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 64,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colorBase.mainGold,
  },
  name: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colorBase.mainGold,
    backgroundColor: colorBase.backgroundDark,
  },
  nameText: {
    fontSize: 36,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  teamAction: {
    backgroundColor: colorBase.backgroundDark,
    margin: 8,
    borderRadius: 50,
    padding: 16,
  },
  award: {
    borderWidth: 2,
  },
});
