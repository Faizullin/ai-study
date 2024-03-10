import { IExport, TTrainStatus, TTrainType } from "./export";

export interface ITrainModelData {
  id: number;
  train_type: TTrainType;
  status: TTrainStatus;
  file: string;
  description: string;
  export: IExport;
  created_at: string;
  updated_at: string;
}
