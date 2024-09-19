import { ColorAliases, colorBase, colorMap } from '@__colors/colorBase';
import React, { FC } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  ActivityIndicatorIOSProps,
  Modal,
  ModalProps,
  View,
} from 'react-native';

interface ILoader extends Omit<ActivityIndicatorIOSProps, 'color'> {
  color: ColorAliases;
}

export const Loader: FC<ILoader> = (props) => {
  const { color } = props;

  const customColor = colorMap[color];
  return <ActivityIndicator {...props} color={customColor} />;
};

interface IModalLoader extends ILoader {
  modalIsOpen: boolean;
  transparent?: ModalProps['transparent'];
}

export const LoaderModal: FC<IModalLoader> = ({
  color,
  modalIsOpen,
  transparent = false,
  ...props
}) => {
  const customColor = colorMap[color];
  return (
    <Modal visible={modalIsOpen} transparent={transparent}>
      <View style={styles.container}>
        <ActivityIndicator {...props} color={customColor} />
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colorBase.white.shadow,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000000
  }
});