import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Missed } from '../../../ui/Missed/BigMissed';
import { colorBase } from '../../../../colors/colorBase';
import { TeamType } from '../../../../types/game.type';
import useAddTeamFault from '../../../../hooks/useAddTeamFault';
import { useAppSelector } from '../../../../store/hooks';

interface IMissedButton {
  teamType: TeamType;
}

export const MissedButton: FC<IMissedButton> = ({ teamType }) => {
  const addTeamFault = useAddTeamFault();
  const redButtonDisabled = useAppSelector(
    (state) => state.teams.redTeam.faultButtonDisabled
  );
  const blueButtonDisabled = useAppSelector((state) => state.teams.blueTeam.faultButtonDisabled);

  return (
    <View style={styles.missedButtonContainer}>
      {teamType === 'RED' && !redButtonDisabled && (
        <Pressable onPress={addTeamFault.bind(this, teamType)}>
          <View style={styles.missedButton}>
            <Missed missedType="GAME" height={150} width={150} />
          </View>
        </Pressable>
      )}
      {teamType === 'BLUE' && !blueButtonDisabled && (
        <Pressable onPress={addTeamFault.bind(this, teamType)}>
          <View style={styles.missedButton}>
            <Missed missedType="GAME" height={150} width={150} />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  missedButtonContainer: {
    alignItems: 'center',
    width: 'auto',
  },
  missedButton: {
    borderWidth: 2,
    borderColor: colorBase.mainGold,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    backgroundColor: colorBase.background.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
