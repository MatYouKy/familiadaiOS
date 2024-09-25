import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ITeam } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import { ActionButton } from '@__components/ui';

interface ICollectButton {
  teamType: ITeam['teamType'];
  handleIsActive: () => void;
}

export const ActiveButton: FC<ICollectButton> = ({ teamType, handleIsActive }) => {
  return (
    <View style={styles[teamType]}>
      <ActionButton
        color="whiteDefault"
        backgroundColor="none"
        title="ACTIVE"
        onPress={handleIsActive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  BLUE: {
    borderWidth: 4,
    borderColor: colorBase.whiteDefault,
    backgroundColor: colorBase.blueLight,
    borderRadius: 50,
  },
  RED: {
    borderWidth: 4,
    borderColor: colorBase.redDefault,
    backgroundColor: colorBase.redShadow,
    borderRadius: 50,
  },
});
