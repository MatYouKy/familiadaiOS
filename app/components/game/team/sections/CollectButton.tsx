import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ITeam } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import { ActionButton } from '@__components/ui';

interface ICollectButton {
  teamType: ITeam['teamType'];
  handleCollectScore: () => void;
}

export const CollectButton: FC<ICollectButton> = ({ teamType, handleCollectScore }) => {
  return (
    <View style={styles[teamType]}>
      <ActionButton
        color="whiteDefault"
        title="Zbierz Punkty"
        backgroundColor="successDark"
        textStyle={
          {textTransform: 'uppercase', 
            letterSpacing: 4
          }
        }
        onPress={handleCollectScore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  BLUE: {
    borderWidth: 2,
    borderColor: colorBase.backgroundDark,
    borderRadius: 8
  },
  RED: {
    borderWidth: 2,
    borderColor: colorBase.redDark,
    borderRadius: 8
  },
});
