import { ColorAliases, colorMap } from '@__colors/colorBase';
import { FontSizeAliases } from '@__components/ui';
import { IconButton } from '@__components/ui/actions/iconButtons/IconButton';
import React, { FC } from 'react';
import { View, StyleSheet, PressableProps } from 'react-native';

interface IActionBar {
  handleEditItem: PressableProps['onPress'];
  handleRemoveItem: PressableProps['onPress'];
  size?: FontSizeAliases;
  separatorColor?: ColorAliases;
  separatorWidth?: number;
  backgroundColor?: ColorAliases;
}

export const ActionBar: FC<IActionBar> = ({
  handleEditItem,
  handleRemoveItem,
  size = 'medium',
  separatorColor = 'bluePastel',
  separatorWidth = 1,
  backgroundColor = 'backgroundDark'
}) => {
  const customSeparatorStyle = {
    ...styles.verticalSeparator,
    borderColor: colorMap[separatorColor],
    borderWidth: separatorWidth,
  };
  return (
    <View style={styles.actionBarContainer}>
      <IconButton
        action="EDIT"
        onPress={handleEditItem}
        color="mainGold"
        size={size}
        backgroundColor={backgroundColor}
      />
      <View style={customSeparatorStyle} />
      <IconButton
        action="DELETE"
        onPress={handleRemoveItem}
        color="mainGold"
        size={size}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionBarContainer: {
    flexDirection: 'row',
    padding: 4,
  },
  verticalSeparator: {
    width: 1,
    marginHorizontal: 12,
  },
});
