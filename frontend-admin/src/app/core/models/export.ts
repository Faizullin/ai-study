export type TTrainType = "content-based" | "collaborative";
export type TTrainStatus = "planned" | "completed" | "error" | "processing";

export interface IExport {
  id: number;
  train_type: TTrainType;
  status: TTrainStatus;
  file: string;
  created_at: string;
  updated_at: string;
}
