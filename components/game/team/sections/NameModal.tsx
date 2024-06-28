/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { colorBase } from '../../../../colors/colorBase';
import { TeamType } from '../../../../types/game.type';
import { useAppDispatch } from '../../../../store/hooks';
import {
  changeBlueTeamName,
  changeRedTeamName,
} from '../../../../store/slices/teamsState';

interface INameModal {
  isOpen: boolean;
  closeModal: (isOpen: boolean) => void;
  currentName: string;
  teamType: TeamType;
}

export const NameModal: FC<INameModal> = ({
  isOpen,
  closeModal,
  currentName,
  teamType,
}) => {
  const dispatch = useAppDispatch();
  const [teamName, setTeamName] = useState(currentName);
  const teamVarriable =
    teamType === 'BLUE'
      ? {
          color: colorBase.blue.default,
          hoverColor: colorBase.blue.default,
          heading: 'Zmień nazwę drużyny Niebieskiej!',
        }
      : {
          color: colorBase.red.default,
          hoverColor: colorBase.red.shadow,
          heading: 'Zmień nazwę drużyny Czerwonej!',
        };

  const handleChangeName = (name: string) => {
    setTeamName(name);
  };

  const changeName = () => {
    if (teamType === 'BLUE') {
      dispatch(changeBlueTeamName(teamName));
    } else {
      dispatch(changeRedTeamName(teamName));
    }

    closeModal(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      changeName();
    }
  };

  return (
    <Modal visible={isOpen} animationType="fade">
      <View style={styles.modalContainer}>
        <View
          style={{
            ...styles.inputWrapper,
            borderBlockColor: teamVarriable.color,
          }}
        >
          <Text style={styles.inputHeading}>{teamVarriable.heading}</Text>
          <TextInput
            style={styles.inputForm}
            value={teamName}
            onChangeText={handleChangeName}
            onSubmitEditing={changeName}
            onKeyPress={handleKeyPress}
          ></TextInput>
          <View
            style={{
              ...styles.buttonWrapper,
              borderColor: teamVarriable.color,
            }}
          >
            <Button
              color={teamVarriable.hoverColor}
              title="Zmień Nazwę"
              onPress={changeName}
            />
          </View>
          <Button
            color={teamVarriable.hoverColor}
            title="Anuluj"
            onPress={() => closeModal(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colorBase.background.main,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    overflow: 'hidden',
    height: 600,
    width: '80%',
    padding: 48,
    borderWidth: 8,
    borderRadius: 36,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputHeading: {
    textAlign: 'center',
    top: 0,
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 48,
    letterSpacing: 2,
  },
  inputForm: {
    marginBottom: 16,
    padding: 8,
    minWidth: 500,
    borderColor: '#666',
    borderWidth: 2,
    borderRadius: 8,
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  buttonWrapper: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
  },
});
