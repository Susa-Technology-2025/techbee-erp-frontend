import { useState } from "react";
import type { TaskStage, WbsItem } from "./types";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
interface UseDragHandlersProps {
  tasks: WbsItem[];
  columns: TaskStage[];
  setTasks: (tasks: WbsItem[]) => void;
  setColumns: (columns: TaskStage[]) => void;
  moveColumnApi: (column: TaskStage, sequence: number) => void;
  moveCardApi: (
    card: WbsItem,
    updates: { taskStage?: { id: string }; order?: number }
  ) => void;
}
export const useDragHandlers = ({
  tasks,
  columns,
  setTasks,
  setColumns,
  moveColumnApi,
  moveCardApi,
}: UseDragHandlersProps) => {
  const [activeTask, setActiveTask] = useState<WbsItem | null>(null);
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    if (taskId.startsWith("column-")) {
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId.startsWith("column-")) {
      handleColumnDrag(activeId, overId);
    } else {
      handleCardDrag(activeId, overId);
    }
    setActiveTask(null);
  };
  const handleColumnDrag = (activeId: string, overId: string) => {
    const activeColumnId = activeId.replace("column-", "");
    const overColumnId = overId.replace("column-", "");
    if (activeColumnId !== overColumnId) {
      const activeColumn = columns.find((col) => col.id === activeColumnId);
      const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overIndex = columns.findIndex((col) => col.id === overColumnId);
      if (activeColumn && activeIndex !== -1 && overIndex !== -1) {
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        const columnsWithUpdatedSequence = newColumns.map((col, index) => ({
          ...col,
          sequence: index,
        }));
        setColumns(columnsWithUpdatedSequence);

        moveColumnApi(activeColumn, overIndex);
      }
    }
  };
  const handleCardDrag = (activeId: string, overId: string) => {
    const activeTaskId = activeId;
    const activeTask = tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) {
      return;
    }
    if (columns.some((col) => col.id === overId)) {
      const newStatus = overId;
      if (activeTask.taskStage?.id !== newStatus) {
        handleMoveCardToNewColumn(activeTask, newStatus);
      } else {
      }
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) {
        return;
      }
      if (activeTask.taskStage?.id === overTask.taskStage?.id) {
        handleMoveCardSameColumn(activeTask, overTask, overId);
      } else {
        handleMoveCardDifferentColumn(activeTask, overTask, overId);
      }
    }
  };
  const handleMoveCardToNewColumn = (
    activeTask: WbsItem,
    newStatus: string
  ) => {
    console.log(
      "📤 Moving card to new column:",
      activeTask.id,
      "->",
      newStatus
    );
    const updateTasks = (currentTasks: WbsItem[]) => {
      const targetColumnTasks = currentTasks
        .filter((task) => task.taskStage?.id === newStatus)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const newOrder =
        targetColumnTasks.length > 0
          ? Math.max(...targetColumnTasks.map((t) => t.order || 0)) + 1
          : 0;
      return currentTasks.map((task) =>
        task.id === activeTask.id
          ? {
              ...task,
              taskStage: { id: newStatus },
              order: newOrder,
            }
          : task
      );
    };
    const newTasks = updateTasks(tasks);
    setTasks(newTasks);
    moveCardApi(activeTask, {
      taskStage: { id: newStatus },
    });
  };
  const handleMoveCardSameColumn = (
    activeTask: WbsItem,
    overTask: WbsItem,
    overId: string
  ) => {
    const updateTasks = (currentTasks: WbsItem[]) => {
      const columnTasks = currentTasks
        .filter((task) => task.taskStage?.id === activeTask.taskStage?.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const activeIndex = columnTasks.findIndex((t) => t.id === activeTask.id);
      const overIndex = columnTasks.findIndex((t) => t.id === overId);
      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedTasks = arrayMove(
          columnTasks,
          activeIndex,
          overIndex
        ).map((task, index) => ({ ...task, order: index }));
        return currentTasks.map((task) => {
          const updatedTask = reorderedTasks.find((t) => t.id === task.id);
          return updatedTask ? updatedTask : task;
        });
      }
      return currentTasks;
    };
    const newTasks = updateTasks(tasks);
    setTasks(newTasks);
    const movedTask = newTasks.find((t) => t.id === activeTask.id);
    if (movedTask) {
      moveCardApi(activeTask, {
        order: movedTask.order,
      });
    }
  };
  const handleMoveCardDifferentColumn = (
    activeTask: WbsItem,
    overTask: WbsItem,
    overId: string
  ) => {
    const updateTasks = (currentTasks: WbsItem[]) => {
      const targetColumnTasks = currentTasks
        .filter((task) => task.taskStage?.id === overTask.taskStage?.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const overIndex = targetColumnTasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) {
        const newOrder = overIndex;
        const updatedTargetTasks = targetColumnTasks.map((task, index) => ({
          ...task,
          order: index >= overIndex ? index + 1 : index,
        }));
        const updatedActiveTask = {
          ...activeTask,
          taskStage: { id: overTask.taskStage?.id },
          order: newOrder,
        };
        const result = currentTasks.map((task) => {
          if (task.id === activeTask.id) return updatedActiveTask;
          const updatedTask = updatedTargetTasks.find((t) => t.id === task.id);
          return updatedTask ? updatedTask : task;
        });
        return result;
      }
      return currentTasks;
    };
    const newTasks = updateTasks(tasks);
    setTasks(newTasks);
    const movedTask = newTasks.find((t) => t.id === activeTask.id);
    if (movedTask) {
      moveCardApi(activeTask, {
        taskStage: { id: movedTask.taskStage?.id },
        order: movedTask.order,
      });
    }
  };
  return {
    activeTask,
    handleDragStart,
    handleDragEnd,
  };
};
