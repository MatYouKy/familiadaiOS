import React, { FC } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { colorBase } from '@__colors/colorBase';

interface IRestartSessionModal {
  openModal: boolean;
  closeModal: () => void;
  title: string;
  id: string;
  handleRemoveItem: (id: string) => void;
}

export const WarringModal: FC<IRestartSessionModal> = ({
  openModal,
  closeModal,
  title,
  id,
  handleRemoveItem,
}) => {
  return (
    <Modal visible={openModal}>
      <View style={styles.modalWrapper}>
        <View style={styles.contentWrapper}>
          <Text style={styles.heading}>
            Jesteś pewien, że chcesz usunąć pytanie {title}?
          </Text>
          <View style={styles.buttonsWrapper}>
            <View
              style={{
                ...styles.buttonWrapper,
                borderColor: colorBase.blue.main,
              }}
            >
              <Button title="Anuluj" onPress={closeModal} />
            </View>
            <View
              style={{
                ...styles.buttonWrapper,
                borderColor: colorBase.mainGold,
              }}
            >
              {id &&
              <Button
                title="Usuń"
                color={colorBase.mainGold}
                onPress={handleRemoveItem.bind(this, id)}
              />
}
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
    color: colorBase.white.default,
    fontSize: 24,
    marginBottom: 48,
    textAlign: 'center',
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
