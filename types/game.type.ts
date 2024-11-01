/* eslint-disable @typescript-eslint/no-explicit-any */
export type MultiplierType = 1 | 2 | 3;
export type SnackbarStatus = 'EDIT' | 'ERROR' | 'SUCCESS' | null;
export type RoundStatus = number;
export type TeamType = 'RED' | 'BLUE';
export type ClientType = 'TABLET' | 'BOARD';
export type GameStatus =
  | 'BATTLE'
  | 'GAME'
  | 'SUMMARY-GAME'
  | 'BOARD-BLOCKED'
  | 'EXTRA-GAME'
  | 'NEXT-ROUND'
  | 'END-GAME';
export type GameProgress = 'INIT' | 'START' | 'QUIZ' | 'END';
export type ConnectType = 'success' | 'pending' | 'error' | 'close' | null;

export interface ISnackbar {
  status: SnackbarStatus;
  message: string;
  snackbarHideAfter?: number;
}

export interface IConnect {
  status: ConnectType;
  message: string;
  ipAddress?: string | null;
}

export interface IGameTeam
  extends Omit<
    ITeam,
    'extraGame' | 'isActive' | 'faultButtonDisabled' | 'collectButton' | 'activeButton'
  > {}

export interface IGameBoard {
  answers: IAnswer[];
  id?: string;
  question: string;
  score: number;
  roundNumber: number;
  gameProgress: GameProgress;
  gameStatus: GameStatus;
  introMusic: boolean;
  stationActive?: boolean;
}

export interface IFault {
  fault: 'BATTLE' | 'GAME';
}

export interface IGameTeams {
  redTeam: ITeam;
  blueTeam: ITeam;
  teamSwap: boolean;
}

export interface IQuiz {
  questions: IQuestion[];
}

export interface IAnswer {
  id: string;
  text: string;
  score: number;
  isVisible?: boolean;
}

export interface IQuestion {
  id: string;
  question: string;
  multiplier: MultiplierType;
  answers: IAnswer[];
}

export interface ICompetition {
  competitionTitle: string;
  id: string;
  questions: IQuestion[];
  eventDate: string;
}

export interface IManageCompetition {
  currentCompetitions: ICompetition[];
  editedCompetition: ICompetition;
}

export type ItemType = ICompetition | IQuestion | IAnswer;

export interface ITeam {
  teamType: TeamType;
  totalScore: number;
  fault: IFault[];
  name: string;
  extraGame: boolean;
  isActive: boolean;
  faultButtonDisabled: boolean;
  collectButton: boolean;
  activeButton: boolean;
  stationActive?: boolean;
}

export interface IGame {
  id: string;
  score: number;
  roundNumber: RoundStatus;
  currentQuestion: IQuestion;
  gameTeams: IGameTeams;
  gameStatus: GameStatus;
  sessionActive: boolean;
}

export interface ICompetitions {
  competitions: ICompetition[];
}
export type IGlobal = Omit<
  IGame,
  | 'currentQuestion'
  | 'score'
  | 'teams'
  | 'id'
  | 'roundNumber'
  | 'gameTeams'
  | 'gameStatus'
> & { questions: IQuestion[]; gameProgress: GameProgress };
export type IBoard = Omit<
  IGame,
  'teams' | 'id' | 'connected' | 'ipAddress' | 'sessionActive' | 'gameTeams'
> & {
  showNextBattleButton: boolean;
  showNextRoundButton: boolean;
  showEndGameButton: boolean;
  introMusic: boolean;
  startCompetition: boolean;
  boardBlocked?: boolean;
};

export interface IPulpit {
  redButton: boolean;
  blueButton: boolean;
}


export type WebSocketMessageType =
  | 'connect'
  | 'red-team'
  | 'blue-team'
  | 'board'
  | 'pulpit'
  | 'ping'
  | 'pong';

export interface IWebSocketMessage {
  type: WebSocketMessageType;
  payload: IGameTeam | IGameBoard | ConnectType | WebsocketPingPong | WebsocketPulpit;
}

export interface WebsocketBoard {
  type: WebSocketMessageType;
  payload: IGameBoard;
}
export interface WebsocketTeam {
  type: WebSocketMessageType;
  payload: IGameTeam;
}
export interface WebsocketPingPong {
  type: WebSocketMessageType;
  payload: any;
}
export interface WebsocketPulpit {
  type: WebSocketMessageType;
  payload: IPulpit;
}

