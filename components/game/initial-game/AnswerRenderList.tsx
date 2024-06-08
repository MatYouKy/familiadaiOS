import React, { FC, useState } from 'react';
import { IAnswer } from '../../../types/game.type';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Divider } from '../../ui/divider/Divider';
import { ActionButton } from '../../ui/actions/ActionButton';
import { colorBase } from '../../../colors/colorBase';

interface IAnswerRenderList {
  answers: IAnswer[];
}

export const AnswerRenderList: FC<IAnswerRenderList> = ({ answers }) => {
  const [showItems, setShowItems] = useState(false);

  const handleToggleQuestion = () => {
    setShowItems((prev) => !prev);
  };

  return (
    <>
      <FlatList
        data={answers}
        keyExtractor={(item) => {
          return item.id as string;
        }}
        renderItem={(answer) => {
          return (
            <View style={{ paddingHorizontal: 24 }}>
              {showItems && (
                <>
                  <View style={styles.answerItemTextWrapper}>
                    <Text style={styles.answerItemText}>
                      {answer.item.text}
                    </Text>
                    <Text style={styles.answerItemText}>
                      {answer.item.score}
                    </Text>
                  </View>
                  <Divider fullwidth height={0.5} color="blueDark" />
                </>
              )}
            </View>
          );
        }}
      />
      <View style={styles.showButtonWrapper}>
        <ActionButton
          title={showItems ? 'Schowaj' : 'Pokaż'}
          onPress={handleToggleQuestion}
          size="x-small"
          color="redLight"
          backgroundColor="transparent"
        />
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  answerItemTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerItemText: {
    color: colorBase.white,
    margin: 4,
  },
  showButtonWrapper: {
    marginVertical: 8,
    width: '100%',
    flexDirection: 'row',
  },
});