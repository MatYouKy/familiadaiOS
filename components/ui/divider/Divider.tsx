import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorAliases, colorBase, colorMap } from '@__colors/colorBase';

interface IDivider {
  fullwidth?: boolean;
  height?: number;
  color?: ColorAliases;
}

export const Divider: FC<IDivider> = ({ fullwidth = false, height = 1, color = 'mainGold' }) => {
  return (
    <View style={styles.divider}>
      <View
        style={{
          ...styles.dividerContent,
          backgroundColor: colorMap[color],
          width: fullwidth ? '100%' : '80%',
          height
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 24,
    alignItems: 'center',
  },
  dividerContent: {
    width: '80%',
    borderColor: colorBase.mainGold,
  },
});
