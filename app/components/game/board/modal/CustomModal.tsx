import React, { FC } from 'react';
import { ButtonProps, Modal, StyleSheet, Text, View } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { ActionButton, Divider } from '@__components/ui';

interface IRestartSessionModal {
  openModal: boolean;
  leftButtonOnPress: ButtonProps['onPress'];
  rigntButtonOnPress: ButtonProps['onPress'];
  modalText: string;
  leftButtonLabel: string;
  rigntButtonLabel: string;
  warringModal?: boolean;
}

export const CustomModal: FC<IRestartSessionModal> = ({
  openModal,
  modalText,
  leftButtonLabel,
  rigntButtonLabel,
  leftButtonOnPress,
  rigntButtonOnPress,
  warringModal = false,
}) => {
  return (
    <Modal visible={openModal} animationType="fade">
      <View style={styles.modalWrapper}>
        <View style={styles.contentWrapper}>
          <Text style={styles.heading}>{modalText}</Text>
          <Divider height={5} color="mainGold" />
          <View style={styles.buttonsWrapper}>
            <View
              style={{
                ...styles.buttonWrapper,
              }}
            >
              <ActionButton
                onPress={leftButtonOnPress}
                title={leftButtonLabel}
                color="white"
                backgroundColor={warringModal ? 'redDefault' : 'black'}
              />
            </View>
            <View
              style={{
                ...styles.buttonWrapper,
              }}
            >
              <ActionButton
                onPress={rigntButtonOnPress}
                title={rigntButtonLabel}
                color="white"
                backgroundColor={warringModal ? 'bluePastel' : 'black'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: colorBase.backgroundMain,
    flex: 1,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: colorBase.whiteDefault,
    fontSize: 24,
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: 660,
  },
  buttonWrapper: {
    height: 'auto',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 24,
  },
  contentWrapper: {
    borderRadius: 24,
    padding: 64,
    backgroundColor: colorBase.backgroundDark,
    borderWidth: 5,
    borderColor: colorBase.redDefault,
    maxWidth: '65%',
  },
});
