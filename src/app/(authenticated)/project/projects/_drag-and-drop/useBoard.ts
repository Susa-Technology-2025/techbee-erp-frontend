import type { TaskStage, WbsItem } from "./types";
import {
  useColumnsData,
  useCardsData,
  useMoveColumn,
  useMoveCard,
} from "./board-api";

interface UseBoardDataProps {
  project: any;
}

export const useBoardData = ({ project }: UseBoardDataProps) => {
  const {
    data: columnsResponse,
    isLoading: isColumnsLoading,
    isError: isColumnsError,
    isSuccess: isColumnsSuccess,
  } = useColumnsData(project);

  const {
    data: cardsResponse,
    isLoading: isCardsLoading,
    isError: isCardsError,
    isSuccess: isCardsSuccess,
  } = useCardsData(project);

  const { moveColumn: moveColumnApi, isMoving: isColumnMoving } =
    useMoveColumn();
  const { moveCard: moveCardApi, isMoving: isCardMoving } = useMoveCard();

  // Use API data directly without transformation
  const columns: TaskStage[] = isColumnsSuccess ? columnsResponse.data : [];
  const tasks: WbsItem[] = isCardsSuccess ? cardsResponse.data : [];

  return {
    columns,
    tasks,
    moveColumnApi,
    moveCardApi,
    isColumnsLoading,
    isCardsLoading,
    isColumnsError,
    isCardsError,
    isColumnMoving,
    isCardMoving,
  };
};
