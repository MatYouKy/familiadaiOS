import React, { FC } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch } from '../../../../store/hooks';
import { colorBase } from '../../../../colors/colorBase';
import { updateGameProgress } from '../../../../store/slices/globalStateReducer';

interface IRestartSessionModal {
  openModal: boolean;
  closeModal: () => void;
}

export const RestartSessionModal: FC<IRestartSessionModal> = ({
  openModal,
  closeModal,
}) => {
  const dispatch = useAppDispatch();
  const handleBack = () => {
    dispatch(updateGameProgress('INIT'));
  };

  return (
    <Modal visible={openModal}>
      <View style={styles.modalWrapper}>
        <View style={styles.contentWrapper}>
          <Text style={styles.heading}>
            Jesteś pewien, że chcesz wyjść z gry i rozpocząć sesje od nowa?
          </Text>
          <View style={styles.buttonsWrapper}>
            <View
              style={{
                ...styles.buttonWrapper,
                borderColor: colorBase.blue.main,
              }}
            >
              <Button title="WYJDŹ" onPress={handleBack} />
            </View>
            <View
              style={{
                ...styles.buttonWrapper,
                borderColor: colorBase.mainGold,
              }}
            >
              <Button
                title="GRAJ DALEJ"
                color={colorBase.mainGold}
                onPress={closeModal}
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
    backgroundColor: colorBase.background.main,
    flex: 1,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: colorBase.white,
    fontSize: 24,
    marginBottom: 48,
    textAlign: 'center'
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 660,
  },
  buttonWrapper: {
    borderWidth: 2,
    height: 'auto',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 24,
  },
  contentWrapper: {
    borderRadius: 24,
    padding: 64,
    backgroundColor: colorBase.background.dark,
  },
});
