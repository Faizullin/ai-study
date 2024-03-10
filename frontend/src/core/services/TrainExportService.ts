import $api from "../http";
import { AxiosResponse } from "axios";
import { ITrainModelData } from "../models/ITrainModelData";
import { IDataResponse } from "../models/response/IDataResponse";

export default class TrainExportService {
  static async getTrainExportList(
    filters: any
  ): Promise<AxiosResponse<IDataResponse<ITrainModelData>>> {
    return $api.get("/mlrec/train_data/", {
      params: {
        ...filters,
      },
    });
  }
}
