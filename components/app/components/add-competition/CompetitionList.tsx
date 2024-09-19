import { ICompetition } from '@__types/game.type';
import React, { FC } from 'react';
import { FlatList, View } from 'react-native';
import { useAppSelector } from '@__store/hooks';
import { QuestionItem } from './QuestionItem';

interface ICompetitionList {
  handleInputChange: (name: keyof ICompetition, value: string) => void;
}

export const CompetitionList: FC<ICompetitionList> = () => {
  const { editedCompetition } = useAppSelector((state) => state.competitions);
  const { questions } = editedCompetition;

  return (
    <View>
      <FlatList
        keyExtractor={(item) => {
          return item.id as string;
        }}
        data={questions}
        renderItem={(question) => {
          return (
            <QuestionItem
              index={question.index + 1}
              question={question.item}
            />
          );
        }}
      />
    </View>
  );
};
