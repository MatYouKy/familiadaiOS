import React, { FC } from 'react'
import { Button, StyleSheet, View } from 'react-native';
import { ITeam } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';

interface ICollectButton {
  teamType: ITeam['teamType'];
  handleCollectScore: () => void;
}

export const CollectButton: FC<ICollectButton> = ({ teamType, handleCollectScore }) => {
  return (
    <View style={styles[teamType]}>
      <Button
        color={colorBase.white.default}
        title="COLLECT"
        onPress={handleCollectScore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  BLUE: {
    borderWidth: 2,
    borderColor: colorBase.mainGold,
    borderRadius: 50,
  },
  RED: {
    borderWidth: 2,
    borderColor: colorBase.white.default,
    borderRadius: 50,
  },
});
