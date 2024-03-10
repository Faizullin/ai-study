import $api from "../http";
import { AxiosResponse } from "axios";
import {
  IAuthUser,
  IChangePasswordProps,
  IStudentData,
  IUserData,
} from "../models/IAuthUser";

export interface ILoginProps {
  email: string;
  password: string;
}
export interface IRegisterProps {
  email: string;
  password: string;
  password_confirmation: string;
}

export default class UserService {
  static async fetchUser(): Promise<AxiosResponse<IAuthUser>> {
    return $api.get<IAuthUser>("/user/");
  }
  static async fetchUserData(): Promise<AxiosResponse<IUserData>> {
    return $api.get<IUserData>("/user/");
  }
  static async changePassword(
    data: IChangePasswordProps
  ): Promise<AxiosResponse<any>> {
    return $api.patch<any>("/password/edit/", { ...data });
  }
  static async changeProfile(data: FormData): Promise<AxiosResponse<any>> {
    return $api.put<any>("/profile/edit/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
