import { Experience, ExperienceStage } from "../schemas";

export interface EngineState {
  currentStageIndex: number;
  selectedOptions: Record<string, string[]>; // stageId -> optionIds
  customSelections: Record<string, unknown>;
  isCompleted: boolean;
  elapsedSeconds: number;
}

export interface StageComponentProps {
  stage: ExperienceStage;
  experience: Experience;
  onNext: () => void;
  onPrev?: () => void;
  onSelectOption: (optionId: string, isMulti?: boolean) => void;
  selectedOptionIds: string[];
  isLastStage: boolean;
  onAddToMuseum?: () => void;
  onShare?: () => void;
}
