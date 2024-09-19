import React from 'react';
import { FlatList } from 'react-native';
import { Divider } from '@__ui/divider/Divider';
import { CompetitionItem } from './CompetitionItem';
import { useAppSelector } from '@__store/hooks';

export const GameList = () => {
  const competitions = useAppSelector((state) => state.competitions.currentCompetitions);

  return (
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
  );
};
