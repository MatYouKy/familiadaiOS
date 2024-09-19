import React, { FC } from 'react';
import { FlatList, StyleSheet, Text, Pressable, View } from 'react-native';
import { IAnswer } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import useAnswerVisibility from 'app/hooks/useAnswerVisibility';

interface IAnswerList {
  list: IAnswer[];
}

export const AnswerList: FC<IAnswerList> = ({ list }) => {
  const { toggleAnswerVisibility } = useAnswerVisibility();

  const handleAnswerItem = (id: string) => {
    toggleAnswerVisibility(id);
  };

  return (
    <FlatList
      style={styles.list}
      keyExtractor={(item) => {
        return item.id as string;
      }}
      data={list}
      renderItem={(answer) => {
        return (
          <Pressable
            style={({ pressed }) => {
              return pressed && styles.pressedItem;
            }}
            onPress={handleAnswerItem.bind(this, answer.item.id)}
          >
            <View
              style={{
                ...styles.listItem,
                backgroundColor: answer.item.isVisible
                  ? '#001100'
                  : colorBase.background.main,
              }}
            >
              <Text
                style={{
                  ...styles.listItemText,
                  textDecorationLine: answer.item.isVisible ? 'line-through' : 'none',
                }}
              >
                {answer.item.text}
              </Text>
              <Text
                style={{
                  ...styles.listItemText,
                  textDecorationLine: answer.item.isVisible ? 'line-through' : 'none',
                }}
              >
                {answer.item.score}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  listItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    marginTop: 8,
    marginBottom: 8,
    borderColor: colorBase.mainGold,
    backgroundColor: '#ff3355',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemText: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colorBase.white.default,
    padding: 16,
    fontSize: 24,
  },
  pressedItem: {
    opacity: 0.1,
  },
});
