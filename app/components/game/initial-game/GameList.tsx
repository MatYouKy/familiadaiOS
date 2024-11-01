import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { Divider } from '@__ui/divider/Divider';
import { CompetitionItem } from './CompetitionItem';
import { useAppSelector } from '@__store/hooks';
import { colorBase } from '@__colors/colorBase';

export const GameList = () => {
  const competitions = useAppSelector((state) => state.competitions.currentCompetitions);

  return (
    <>
      {competitions.length ? (
        <FlatList
          keyExtractor={(item) => {
            return item.id as string;
          }}
          data={competitions}
          renderItem={(competition) => {
            return (
              <>
                <CompetitionItem competition={competition.item} />
                <Divider fullwidth />
              </>
            );
          }}
        />
      ) : (
        <View style={styles.emptyList}>
          <Text style={styles.emptyListText}>Lista Wydażeń jest pusta </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    alignItems: 'center'
  },
  emptyListText: {
    color: colorBase.whiteDefault,
    textTransform: 'uppercase',
    fontSize: 24
  },
});
