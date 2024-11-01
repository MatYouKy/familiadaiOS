import React, { FC} from 'react';
import { View, StyleSheet } from 'react-native';
import { GameTeam } from './team/GameTeam';
import { GameBoard } from './board/GameBoard';
import { ITeam } from '@__types/game.type';
import { useAppSelector } from '@__store/hooks';
import { colorBase } from '@__colors/colorBase';

interface IGameLayout {
  blueTeam: ITeam;
  redTeam: ITeam;
  handleRefresh: () => void;
}

const GameLayout: FC<IGameLayout> = ({ blueTeam, redTeam, handleRefresh }) => {
  const teamSwap = useAppSelector((state) => state.teams.teamSwap);
  const redTeamSwapStyle = {
    ...styles.redTeam,
    borderRightWidth: teamSwap ? 0 : 2,
    borderLeftWidth: teamSwap ? 2 : 0,
  };
  const blueTeamSwapStyle = {
    ...styles.blueTeam,
    borderRightWidth: teamSwap ? 2 : 0,
    borderLeftWidth: teamSwap ? 0 : 2,
  };
  
  return (
    <View style={styles.gameContainer}>
      {teamSwap ? (
        <>
          <View style={blueTeamSwapStyle}>
            <GameTeam teamData={blueTeam} />
          </View>
          <View style={styles.table}>
            <GameBoard handleRefresh={handleRefresh} />
          </View>
          <View style={redTeamSwapStyle}>
            <GameTeam teamData={redTeam} />
          </View>
        </>
      ) : (
        <>
          <View style={redTeamSwapStyle}>
            <GameTeam teamData={redTeam} />
          </View>
          <View style={styles.table}>
            <GameBoard handleRefresh={handleRefresh} />
          </View>
          <View style={blueTeamSwapStyle}>
            <GameTeam teamData={blueTeam} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: colorBase.mainGold,
  },
  redTeam: {
    width: 300,
    borderColor: colorBase.mainGold,
  },
  blueTeam: {
    width: 300,
    borderColor: colorBase.mainGold,
  },
  table: {
    flex: 1,
    flexDirection: 'row',
  },
  ipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ipTextInput: {
    borderBottomWidth: 1,
    marginRight: 10,
  },
});

export default GameLayout;