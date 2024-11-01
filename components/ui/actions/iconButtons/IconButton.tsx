import React, { FC, ReactElement } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from 'react-native';
import { ColorAliases, colorBase, colorMap } from '@__colors/colorBase';
import { SvgProps } from 'react-native-svg';
import { AddIcon } from '@__components/ui/icons/AddIcon';
import { EditIcon } from '@__components/ui/icons/EditIcon';
import { DeleteIcon } from '@__components/ui/icons/DeleteIcon';
import { ActionIconType, CustomSVGIntrface, SizeAliases } from '@__types/ui.type';
import { sizeMap } from '@__utils/sizeMap';
import { PlayIcon } from '@__components/ui/icons/PlayIcon';
import { RefreshIcon } from '@__components/ui/icons/RefreshIcon';
import { InfoIcon } from '@__components/ui/icons/InfoIcon';
import { SwapIcon } from '@__components/ui/icons/SwapIcon';
import { BackIcon } from '@__components/ui/icons/BackIcon';
import { AwardIcon } from '@__components/ui/icons/AwardIcon';
import { UndoIcon } from '@__components/ui/icons/UndoIcon';
import { RedoIcon } from '@__components/ui/icons/RedoIcon';

interface IActionButton {
  optionalText?: string;
  disabled?: boolean;
  onPress: PressableProps['onPress'];
  action: ActionIconType;
  variant?: 'OUTLINED' | 'SMALL' | 'DEFAULT';
  backgroundColor?: ColorAliases;
  color: ColorAliases;
  fill?: ColorAliases;
  size: SizeAliases;
  buttonStyle?: ViewStyle;
  iconProps?: Partial<CustomSVGIntrface>;
}

const getIcon = (
  action: ActionIconType,
  color: ColorAliases = 'whiteDefault',
  fill: ColorAliases = 'none',
  size: SizeAliases = 'medium',
  rest?: Partial<CustomSVGIntrface>
): ReactElement<SvgProps> => {
  const iconProps: CustomSVGIntrface = {
    color,
    fill,
    width: sizeMap[size],
    height: sizeMap[size],
    ...rest,
  };

  switch (action) {
    case 'ADD':
      return <AddIcon {...iconProps} />;
    case 'AWARD':
      return <AwardIcon {...iconProps} />;
    case 'EDIT':
      return <EditIcon {...iconProps} />;
    case 'DELETE':
      return <DeleteIcon {...iconProps} />;
    case 'PLAY':
      return <PlayIcon {...iconProps} />;
    case 'REFRESH':
      return <RefreshIcon {...iconProps} />;
    case 'INFO':
      return <InfoIcon {...iconProps} />;
    case 'SWAP':
      return <SwapIcon {...iconProps} />;
    case 'BACK':
      return <BackIcon {...iconProps} />;
    case 'UNDO':
      return <UndoIcon {...iconProps} />;
    case 'REDO':
      return <RedoIcon {...iconProps} />;
    default:
      return <View />;
  }
};

export const IconButton: FC<IActionButton> = ({
  optionalText,
  disabled,
  onPress,
  backgroundColor = 'none',
  buttonStyle,
  color,
  fill,
  action,
  size,
  iconProps,
}) => {
  if (disabled) return;

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colorMap[backgroundColor],
            padding: sizeMap[size] / 3,
            gap: sizeMap[size],
          },
          buttonStyle as ViewStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          {getIcon(action, color, fill, size, iconProps)}
          {optionalText && <Text style={styles.optionalTextStyle}>{optionalText}</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 'auto',
    borderRadius: 36,
  },
  optionalTextStyle: {
    color: colorBase.whiteDefault,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
  },
});
