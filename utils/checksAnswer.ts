import { IAnswer } from '@__types/game.type';

const checkAnswerVisibility = (answers: IAnswer[]) => {
  const visibleAnswers = answers.filter((answer) => answer.isVisible);

  const onlyOneVisible = visibleAnswers.length === 1;

  let firstAnswerVisibleAndOthersNot = false;
  if (answers.length > 0) {
    const firstAnswerVisible = !!answers[0].isVisible;
    const othersNotVisible = answers.slice(1).every((answer) => !answer.isVisible);
    firstAnswerVisibleAndOthersNot = firstAnswerVisible && othersNotVisible;
  }

  const anyAnswerVisible = visibleAnswers.length > 0;

  const twoAnswersVisible = visibleAnswers.length === 2;

  const allVisible = answers.length > 0 && visibleAnswers.length === answers.length;

  return {
    onlyOneVisible,
    firstAnswerVisibleAndOthersNot,
    anyAnswerVisible,
    twoAnswersVisible,
    allVisible,
  };
};

export default checkAnswerVisibility;
