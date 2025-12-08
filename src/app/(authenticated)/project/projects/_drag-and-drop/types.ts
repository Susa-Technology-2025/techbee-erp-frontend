export interface TaskStage {
  id: string;
  title: string;
  sequence?: number;
  description: string;
}
export interface WbsItem {
  id: string;
  title: string;

  description?: string;
  taskStage: {
    id: string;
  };
  order?: number;
}
export type Column = TaskStage;
export type Task = WbsItem;
