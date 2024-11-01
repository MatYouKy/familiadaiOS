import React, { FC } from 'react';
import { FlatList, StyleSheet, Text, Pressable, View } from 'react-native';
import { IAnswer } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import { useAppSelector } from '@__store/hooks';
import useLogic from '../../../hooks/useLogic';

interface IAnswerList {
  list: IAnswer[];
  multiplier: number;
}

export const AnswerList: FC<IAnswerList> = ({ list, multiplier }) => {
  const { toggleAnswer, currentList } = useLogic(list, multiplier);
  const { boardBlocked } = useAppSelector((state) => state.gameState);

  const handleAnswerItem = (id: string) => {
    if (!boardBlocked) {
      toggleAnswer(id);
    }
  };

  return (
    <FlatList
      style={styles.list}
      keyExtractor={(item) => {
        return item.id as string;
      }}
      data={currentList}
      renderItem={(answer) => {
        return (
          <Pressable
            style={({ pressed }) => {
              return pressed && styles.pressedItem;
            }}
            onPress={handleAnswerItem.bind(this, answer.item.id)}
          >
            {answer.item.isVisible && (
              <View style={styles.lineThrough}>
                <View style={styles.line}></View>
              </View>
            )}
            <View
              style={{
                ...styles.listItem,
                backgroundColor: answer.item.isVisible
                  ? '#001100'
                  : colorBase.backgroundDark,
                borderColor: answer.item.isVisible
                  ? colorBase.whiteShadow
                  : colorBase.mainGold,
              }}
            >
              <Text
                style={{
                  ...styles.listItemText,
                  color: answer.item.isVisible
                    ? colorBase.whiteShadow
                    : colorBase.whiteDefault,
                }}
              >
                {answer.item.text}
              </Text>
              <Text
                style={{
                  ...styles.listItemText,
                  color: answer.item.isVisible
                    ? colorBase.whiteShadow
                    : colorBase.whiteDefault,
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
    position: 'relative',
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
    padding: 16,
    fontSize: 24,
  },
  pressedItem: {
    opacity: 0.1,
  },
  lineThrough: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    padding: 20,
  },
  line: {
    position: 'relative',
    width: '100%',
    height: 1,
    backgroundColor: colorBase.whiteDefault,
    zIndex: 21,
  },
});
