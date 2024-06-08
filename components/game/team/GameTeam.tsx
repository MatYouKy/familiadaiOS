import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ITeam } from '../../../types/game.type';
import { colorBase } from '../../../colors/colorBase';
import { FaultCounter } from './sections/FaultCounter';
import { MissedButton } from './sections/MissedButton';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  blueTeamActive,
  clearFaultFunc,
  redTeamActive,
  updateBlueTotalScore,
  updateRedTotalScore,
} from '../../../store/slices/teamsState';
import { updateSession } from '../../../store/slices/globalStateReducer';
import { updateGameScore, updateGameStatus } from '../../../store/slices/gameState';
import { CollectButton } from './sections/CollectButton';
import { ActiveButton } from './sections/ActiveButton';
import { NameModal } from './sections/NameModal';

interface IGameTeam {
  teamData: ITeam;
}

export const GameTeam: FC<IGameTeam> = ({ teamData }) => {
  const { teamType, fault, name, totalScore, activeButton, collectButton } = teamData;
  const dispatch = useAppDispatch();


  const redIsActive = useAppSelector((state) => state.teams.redTeam.isActive);
  const blueIsActive = useAppSelector((state) => state.teams.blueTeam.isActive);
  const score = useAppSelector((state) => state.gameState.score);
  const gameStatus = useAppSelector((state) => state.gameState.gameStatus);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openChangeNameModal = (open: boolean) => {
    setModalIsOpen(open);
  };

  const handleCollectScore = () => {
    dispatch(updateGameScore(0));

    if (teamType === 'BLUE') {
      dispatch(updateBlueTotalScore(score));
    } else {
      dispatch(updateRedTotalScore(score));
    }
    dispatch(updateGameStatus('SUMMARY-GAME'));
  };

  const handleIsActive = () => {
    dispatch(updateGameStatus('GAME'));
    dispatch(clearFaultFunc());
    dispatch(updateSession(true));
    if (teamType === 'BLUE') {
      return dispatch(blueTeamActive(true));
    }
    return dispatch(redTeamActive(true));
  };

  const teamVarriable =
    teamType === 'BLUE'
      ? {
          color: colorBase.blue.default,
          hoverColor: colorBase.blue.default,
          heading: 'Zmień nazwę drużyny Niebieskiej!',
        }
      : {
          color: colorBase.red.default,
          hoverColor: colorBase.red.shadow,
          heading: 'Zmień nazwę drużyny Czerwonej!',
        };

  const teamBackgroundColor =
    teamType === 'BLUE'
      ? blueIsActive
        ? colorBase.blue.default
        : colorBase.background.main
      : redIsActive
        ? colorBase.red.shadow
        : colorBase.background.main;

  return (
    <View style={styles.container}>
      <NameModal
        isOpen={modalIsOpen}
        closeModal={openChangeNameModal}
        currentName={name}
        teamType={teamType}
      />
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

        {collectButton && (
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
          <MissedButton teamType={teamType} />
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
  },
  actionWrapper: {
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
  },
  nameText: {
    fontSize: 36,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  teamAction: {
    backgroundColor: colorBase.background.dark,
    margin: 8,
    borderRadius: 50,
    padding: 16,
    borderWidth: 2,
  },
});
