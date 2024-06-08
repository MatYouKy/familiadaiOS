import { useState, useEffect } from 'react';
import { IAnswer } from '../types/game.type';

const useAnswerVisibilityChecks = (answers: IAnswer[]) => {
  const [onlyOneVisible, setOnlyOneVisible] = useState(false);
  const [firstAnswerVisibleAndOthersNot, setFirstAnswerVisibleAndOthersNot] =
    useState(false);
  const [anyAnswerVisible, setAnyAnswerVisible] = useState(false);
  const [twoAnswersVisible, setTwoAnswersVisible] = useState(false);
  const [allVisible, setAllVisible] = useState(false);

  useEffect(() => {
    const visibleAnswers = answers.filter((answer) => answer.isVisible);

    setOnlyOneVisible(visibleAnswers.length === 1);

    if (answers.length === 0) {
      setFirstAnswerVisibleAndOthersNot(false);
    } else {
      const firstAnswerVisible = !!answers[0].isVisible;
      const othersNotVisible = answers.slice(1).every((answer) => !answer.isVisible);
      setFirstAnswerVisibleAndOthersNot(firstAnswerVisible && othersNotVisible);
    }

    setAnyAnswerVisible(visibleAnswers.length > 0);

    setTwoAnswersVisible(visibleAnswers.length === 2);

    setAllVisible(answers.length > 0 && visibleAnswers.length === answers.length);
  }, [answers]);

  return {
    onlyOneVisible,
    firstAnswerVisibleAndOthersNot,
    anyAnswerVisible,
    twoAnswersVisible,
    allVisible,
  };
};

export default useAnswerVisibilityChecks;
