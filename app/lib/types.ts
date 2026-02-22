export type Character = {
  id: number;
  name: string;
  health: number;
  movement: number;
  actions: number;
};

export type ParsedCommand = {
  targetIndex: number | null;
  healthDelta: number;
  movementDelta: number;
  actionsDelta: number;
};
