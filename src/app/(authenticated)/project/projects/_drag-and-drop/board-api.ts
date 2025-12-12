import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import type { TaskStage, WbsItem } from "./types";
import { useState } from "react";

export interface Project {
  taskStageSet?: {
    id: string;
  };
}

export const useColumnsData = (project: Project) => {
  return useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/project/taskStages?where[setField][id]=${project?.taskStageSet?.id}`,
    enabled: Boolean(project?.taskStageSet?.id),
    // noFilter: true,
  });
};

export const useCardsData = (project: Project) => {
  return useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/project/wbsItems?where[project][id]=${project?.id}`,
    enabled: Boolean(project?.taskStageSet?.id),
    // noFilter: true,
  });
};

export const useMoveColumn = (onErrorRollback?: () => void) => {
  const [movingColumn, setMovingColumn] = useState<TaskStage | null>(null);

  const { mutate: moveColumnMutation, isPending: isMoving } = useDataMutation({
    apiEndPoint: movingColumn
      ? `https://api.techbee.et/api/project/taskStages/${movingColumn.id}`
      : "",
    onSuccess: (message) => {
      console.log("Column moved successfully:", message);
      setMovingColumn(null);
    },
    onError: (error) => {
      console.error("Failed to move column:", error);
      setMovingColumn(null);
      // Trigger rollback on error
      if (onErrorRollback) {
        onErrorRollback();
      }
    },
    method: "PATCH",
  });

  const moveColumn = (column: TaskStage, sequence: number) => {
    console.log("Moving column:", column.id, "to sequence:", sequence);
    setMovingColumn(column);
    moveColumnMutation({ sequence });
  };

  return {
    moveColumn,
    isMoving,
  };
};

export const useMoveCard = (onErrorRollback?: () => void) => {
  const [movingCard, setMovingCard] = useState<WbsItem | null>(null);

  const { mutate: moveCardMutation, isPending: isMoving } = useDataMutation({
    apiEndPoint: movingCard
      ? `https://api.techbee.et/api/project/wbsItems/${movingCard.id}`
      : "",
    onSuccess: (message) => {
      console.log("Card moved successfully:", message);
      setMovingCard(null);
    },
    onError: (error) => {
      console.error("Failed to move card:", error);
      setMovingCard(null);
      // Trigger rollback on error
      if (onErrorRollback) {
        onErrorRollback();
      }
    },
    method: "PATCH",
  });

  const moveCard = (
    card: WbsItem,
    updates: { taskStage?: { id: string }; order?: number }
  ) => {
    console.log("Moving card:", card.id, "with updates:", updates);
    setMovingCard(card);

    const requestBody: any = {};

    if (updates.taskStage) {
      requestBody.taskStage = updates.taskStage;
    }

    if (updates.order !== undefined) {
      requestBody.order = updates.order;
    }

    moveCardMutation(requestBody);
  };

  return {
    moveCard,
    isMoving,
  };
};
