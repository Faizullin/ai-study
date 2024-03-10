import { TimestampedModel } from "./TimestampedModel";

export interface ITrainModelData extends TimestampedModel {
  // rmse_accuracy: number;
  // mai_accuracy: number;
  description: string;
  documents_involved_count: number;
  users_involved_count: number;
  status: "completed" | "error" | "planned" | "processing";
  train_type: "collaborative" | "content-based";
}

export interface ITrainCfModelData {
  description: string;
  documents_involved_count: number;
  users_involved_count: number;
  status: "completed" | "error" | "planned" | "processing";
  train_type: "collaborative" | "content-based";
  rmse_accuracy: number;
  mai_accuracy: number;
}
