import React, { FC } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ICompetitions } from '../../../types/game.type';
import { colorBase } from '../../../colors/colorBase';
import { Divider } from '../../ui/divider/Divider';
import { CompetitionItem } from './CompetitionItem';

export const GameList: FC<ICompetitions> = ({ competitions }) => {
  const handleGameList = () => {
    // const newList = competitions.map((competition) => {
    //   return competition.competitionTitle;
    // });
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        keyExtractor={(item) => {
          return item.id as string;
        }}
        data={competitions}
        renderItem={(competition) => {
          return (
            <Pressable
              style={({ pressed }) => {
                return pressed && styles.pressedItem;
              }}
              onPress={handleGameList}
            >
              <CompetitionItem competition={competition.item} />
              <Divider fullwidth />
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    borderWidth: 2,
    borderColor: colorBase.white,
    padding: 48,
    borderRadius: 48,
  },
  listItemText: {
    color: colorBase.white,
  },
  pressedItem: {},
});
