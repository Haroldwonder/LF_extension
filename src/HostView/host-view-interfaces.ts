// src/host-view/interfaces/host-view.interface.ts
export interface IDisplaySettings {
  fontSize: number;
  showPlayerScores: boolean;
  showPlayerAnswers: boolean;
  showTimer: boolean;
}

export interface IHostView {
  gameId: string;
  hostId: string;
  displaySettings: IDisplaySettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayerStatus {
  playerId: string;
  username: string;
  isConnected: boolean;
  lastActiveAt: Date;
  score?: number;
}

// src/host-view/interfaces/host-view-events.interface.ts
export interface IJoinRoomData {
  gameId: string;
}

export interface IDisplaySettingsData {
  gameId: string;
  displaySettings: Partial<IDisplaySettings>;
}

export interface IChallengeData {
  gameId: string;
  challengeId: string;
}
