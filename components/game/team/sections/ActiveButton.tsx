import React, { FC } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ITeam } from '../../../../types/game.type';
import { colorBase } from '../../../../colors/colorBase';

interface ICollectButton {
  teamType: ITeam['teamType'];
  handleIsActive: () => void;
}

export const ActiveButton: FC<ICollectButton> = ({
  teamType,
  handleIsActive,
}) => {
  return (
    <View style={styles[teamType]}>
      <Button color={colorBase.white} title="ACTIVE" onPress={handleIsActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  BLUE: {
    borderWidth: 4,
    borderColor: colorBase.blue.default,
    backgroundColor: colorBase.blue.light,
    borderRadius: 50,
  },
  RED: {
    borderWidth: 4,
    borderColor: colorBase.red.default,
    backgroundColor: colorBase.red.shadow,
    borderRadius: 50,
  },
});
