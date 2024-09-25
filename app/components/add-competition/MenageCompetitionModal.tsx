import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { ICompetition } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from '@__ui/divider/Divider';
import { ActionButton } from '@__components/ui';
import { IconButton } from '@__components/ui/actions/iconButtons/IconButton';
import useFetchData from '@__hooks/useFetchData';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  editCompetitionEventDate,
  editCompetitionTitle,
  initializeCompetitionFunc,
} from '@__store/slices/competitionsStateSlice';
import { CompetitionList } from './CompetitionList';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';
import { QuestionFormModal } from '../add-question/question-form/QuestionFormModal';
import { Input } from '../../../components/ui/Input/Input';

interface IMenageCompetitionModal {
  addQuestionModal: boolean;
  closeModal: () => void;
  editMode?: boolean;
  initialCompetition: ICompetition;
}

export const MenageCompetitionModal: FC<IMenageCompetitionModal> = ({
  addQuestionModal,
  closeModal,
  editMode = false,
  initialCompetition,
}) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<TextInput>(null);
  const { sendData: sendCompetition, editData: editCompetition } = useFetchData();
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [questionModal, setQuestionModal] = useState(false);
  const [isTitleError, setIsTitleError] = useState<boolean>(false);
  const [isDateError, setIsDateError] = useState<boolean>(false);
  const questions = useAppSelector(
    (state) => state.competitions.editedCompetition.questions
  );

  const state = useAppSelector((state) => state.competitions.editedCompetition);

  const handleQuestionModal = (questionModalAction: boolean) => {
    setQuestionModal(questionModalAction);
  };

  const dataPickerModalFunc = (dataPickerModalAction: boolean) => {
    setDatePickerVisibility(dataPickerModalAction);
  };

  const handleInputChange = (value: string) => {
    dispatch(editCompetitionTitle(value));
    setIsTitleError(value.trim().length < 3);
  };

  const handleConfirm = (selectedDate: Date) => {
    const formattedDate = selectedDate.toLocaleDateString('pl-PL');
    const today = new Date().toLocaleDateString('pl-PL');
    dispatch(editCompetitionEventDate(formattedDate));
    setIsDateError(formattedDate < today);
    dataPickerModalFunc(false);
  };

  const handleSubmit = () => {
    if (editMode) {
      editCompetition(state);
    } else {
      sendCompetition(state);
    }
    closeModal();
  };

  const validateQuestions = () => {
    if (questions.length !== 6) {
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Konkurs musi zawierać dokładnie 6 rund.',
        })
      );
      return false;
    }
    return true;
  };

  const actionSubmitButton = () => {
    if (!validateQuestions()) return;

    handleSubmit();
  };

  useEffect(() => {
    dispatch(initializeCompetitionFunc(initialCompetition));
  }, [initialCompetition]);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const isFormInvalid =
    isTitleError ||
    isDateError ||
    state.competitionTitle.trim() === '' ||
    state.eventDate.trim() === '';

  const today = new Date();

  return (
    <Modal visible={addQuestionModal} animationType="fade">
      <View style={styles.appContainer}>
        <View style={styles.topSection}>
          <View style={styles.inputs}>
            <Input
              ref={inputRef}
              label={editMode ? 'Edytuj Nazwę wydarzenia' : 'Wpisz nazwę Wydarzenia'}
              inputProps={{
                onChangeText: (text) => handleInputChange(text),
                placeholder: editMode
                  ? 'Edytuj Nazwę wydarzenia'
                  : 'Wpisz nazwę Wydarzenia',
                value: state.competitionTitle,
              }}
              isError={isTitleError}
              errorText="Nazwa wydarzenia musi mieć co najmniej 3 znaki."           />
            <TouchableOpacity onPress={dataPickerModalFunc.bind(this, true)}>
              <View style={styles.dateInput}>
                <Text style={[styles.dateText, isDateError && styles.errorText]}>
                  {state.eventDate || 'dotknij, aby zmienić datę wydarzenia'}
                </Text>
                {isDateError && (
                  <Text style={styles.errorText}>
                    Data wydarzenia nie może być wcześniejsza niż dzisiaj.
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={dataPickerModalFunc.bind(this, false)}
              minimumDate={today}
              display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
              textColor={colorBase.whiteDefault}
              cancelTextIOS="Anuluj"
              confirmTextIOS="Potwierdź"
              customCancelButtonIOS={() => (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Anuluj"
                    onPress={dataPickerModalFunc.bind(this, false)}
                    color={colorBase.blueLight}
                  />
                </View>
              )}
              pickerStyleIOS={{ backgroundColor: colorBase.backgroundMain }}
              themeVariant="dark"
            />
          </View>
        </View>
        <View>
          <Divider fullwidth color="mainGold" />
        </View>
        <View>
          <CompetitionList handleInputChange={handleInputChange} />
          {questions.length < 6 && (
            <IconButton
              action="ADD"
              onPress={() => handleQuestionModal(true)}
              color="mainGold"
              size="large"
            />
          )}
        </View>
        {questionModal && (
          <QuestionFormModal
            openModal={questionModal}
            onClose={handleQuestionModal.bind(this, false)}
            round={questions.length + 1}
          />
        )}
        <View style={styles.actionButtons}>
          <ActionButton
            onPress={closeModal}
            variant="OUTLINED"
            backgroundColor="redDark"
            title="Anuluj"
          />
          <View style={styles.submitButtonContainer}>
            <ActionButton
              onPress={actionSubmitButton}
              backgroundColor="successMain"
              title={editMode ? 'Aktualizuj Wydarzenie' : 'Dodaj Wydarzenie'}
              disabled={isFormInvalid}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colorBase.backgroundMain,
  },
  heading: {
    color: colorBase.bluePastel,
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  topSection: {
    paddingTop: 48,
  },
  inputs: {
    width: '50%',
    marginHorizontal: 'auto',
    gap: 24,
  },
  dateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#333',
  },
  dateText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
  },
  text: {
    color: colorBase.whiteDefault,
  },
  buttonContainer: {
    padding: 8,
    borderWidth: 2,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderColor: colorBase.blueLight,
    backgroundColor: colorBase.backgroundMain,
  },
  buttonConfirmContainer: {
    padding: 8,
    borderWidth: 4,
    borderColor: colorBase.blueLight,
    overflow: 'hidden',
  },
  question: {
    backgroundColor: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 144,
  },
  submitButtonContainer: {
    alignItems: 'center',
  },
});
