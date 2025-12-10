import { useState, useEffect } from "react";
import type { TaskStage, WbsItem } from "./types";
import { Column } from "./column";
import { AddColumn } from "./add-column";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Box, Alert, CircularProgress } from "@mui/material";
import { useBoardData } from "./useBoard";
import { useDragHandlers } from "./useDraghandlers";
import { TaskCard } from "./card";
interface AppProps {
  project: any;
}
export default function App({ project }: AppProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
        delay: 200,
      },
    })
  );
  const {
    columns: initialColumns,
    tasks: initialTasks,
    moveColumnApi,
    moveCardApi,
    isColumnsLoading,
    isCardsLoading,
    isColumnsError,
    isCardsError,
  } = useBoardData({ project });
  const [tasks, setTasks] = useState<WbsItem[]>([]);
  const [columns, setColumns] = useState<TaskStage[]>([]);
  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);
  useEffect(() => {
    if (initialColumns.length > 0) {
      setColumns(initialColumns);
    }
  }, [initialColumns]);
  const { activeTask, handleDragStart, handleDragEnd } = useDragHandlers({
    tasks,
    columns,
    setTasks,
    setColumns,
    moveColumnApi,
    moveCardApi,
  });
  const handleAddCard = (taskData: Omit<WbsItem, "id">) => {
    const newTask: WbsItem = {
      id: `task-${Date.now()}`,
      ...taskData,
      order: tasks.filter(
        (task) => task.taskStage?.id === taskData.taskStage.id
      ).length,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  const handleAddColumn = (columnData: Omit<TaskStage, "id">) => {
    const newColumnId = `COLUMN-${Date.now()}`;
    const newColumn: TaskStage = {
      id: newColumnId,
      ...columnData,
    };
    setColumns((prevColumns) => [...prevColumns, newColumn]);
  };
  if (isColumnsLoading || isCardsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (isColumnsError || isCardsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Alert severity="error">Error loading data</Alert>
      </Box>
    );
  }

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Box
          sx={{
            gap: 3,
            scrollbarWidth: "none",
            display: "flex",
            flexWrap: "noWrap",
            overflowY: "hidden",
            overflowX: "auto",
            p: 3,
            boxSizing: "border-box",
          }}
        >
          {columns.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.taskStage?.id === column?.id)
              .sort((a, b) => (a.order || 0) - (b.order || 0));
            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                onAddCard={handleAddCard}
                project={project}
              />
            );
          })}
          <AddColumn project={project} onAddColumn={handleAddColumn} />
        </Box>
        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
