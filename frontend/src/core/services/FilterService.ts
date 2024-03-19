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
  static async subscribeCourse(id: number): Promise<AxiosResponse<ICourse[]>> {
    return $api.patch(`/courses/${id}/subscribe/`);
  }
  static async unsubscribeCourse(id: number): Promise<AxiosResponse<ICourse[]>> {
    return $api.delete(`/courses/${id}/subscribe/`);
  }
  static async getSubscribeCourses(): Promise<AxiosResponse<ICourse[]>> {
    return $api.get(`/profile/courses/`);
  }
  static async getSubjects(filters?: any): Promise<AxiosResponse<ISubject[]>> {
    return $api.get("/filters/subjects/", {
      params: {
        ...filters,
      },
    });
  }
}
