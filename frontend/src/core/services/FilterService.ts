import $api from "../http";
import { AxiosResponse } from "axios";
import { ICourse } from "../models/ICourse";
import { ISubject } from "../models/ISubject";

export default class FilterService {
  static async getCourses(filters?: any): Promise<AxiosResponse<ICourse[]>> {
    return $api.get("/filters/courses/", {
      params: {
        ...filters,
      },
    });
  }
  static async getSubjects(filters?: any): Promise<AxiosResponse<ISubject[]>> {
    return $api.get("/filters/subjects/", {
      params: {
        ...filters,
      },
    });
  }
}
