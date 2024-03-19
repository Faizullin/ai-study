import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IAuthUser,
  IForgotPasswordConfirmProps,
  IForgotPasswordProps,
} from "@/core/models/IAuthUser";
import AuthService from "@/core/services/AuthService";
import { AxiosError } from "axios";
import UserService from "@/core/services/UserService";
import { ILoadingState } from "@/core/models/ILoadingState";
import AuthStorageService, {
  AuthStorageConstantKeys,
} from "@/core/services/AuthStorageService";
import FilterService from "@/core/services/FilterService";
import CourseStorageService from "@/core/services/CourseStorageService";
import { ICourse } from "@/core/models/ICourse";

interface IInitialState {
  user: IAuthUser;
  user_subscribed_courses: ICourse[];
  isAuthenticated: boolean;
  loading: ILoadingState;
  errors: any;
  success: boolean;
}

let inititalUser = AuthStorageService.getStorageData()?.["user"] || null;
let initital_user_subscribed_courses =
  CourseStorageService.getStorageData()?.["courses"] || null;
inititalUser = inititalUser !== null ? JSON.parse(inititalUser) : null;
initital_user_subscribed_courses =
  initital_user_subscribed_courses !== null
    ? JSON.parse(initital_user_subscribed_courses)
    : null;
const initialState: IInitialState = {
  user: inititalUser,
  user_subscribed_courses: initital_user_subscribed_courses,
  isAuthenticated: inititalUser?.id ? true : false,
  loading: {
    list: false,
    post: false,
    detail: false,
  },
  errors: {},
  success: false,
};

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.fetchUser();
      return {
        ...response.data,
      };
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values: any, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(values);
      return {
        ...response.data,
      };
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: any, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(values);
      AuthStorageService.setStorageData({
        access_token: response.data.access,
        refresh_token: response.data.refresh,
      });
      const decoded_data = AuthStorageService.getJwtData(response.data.access);
      AuthStorageService.setStorageData({
        expires_at: decoded_data[AuthStorageConstantKeys.expires_at] || null,
      });
      return {
        ...response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "auth/forgotUserPassword",
  async (values: IForgotPasswordProps, { rejectWithValue }) => {
    try {
      const response = await AuthService.forgotUserPassword(values);
      return {
        ...response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const forgotUserPasswordConfirm = createAsyncThunk(
  "auth/forgotUserPasswordConfirm",
  async (values: IForgotPasswordConfirmProps, { rejectWithValue }) => {
    try {
      const response = await AuthService.forgotUserPasswordConfirm(values);
      return {
        ...response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const fetchUserSubscribedCourses = createAsyncThunk(
  "auth/fetchUserSubscribedCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await FilterService.getSubscribeCourses();
      return [...response.data];
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      AuthStorageService.clean();
      CourseStorageService.clean();
      state.isAuthenticated = false;
      (state.loading = {
        detail: false,
      }),
        (state.errors = initialState.errors);
    },
    setUserProfileCourses: (state, action) => {
      state.user_subscribed_courses = action.payload;
      CourseStorageService.setStorageData({
        courses: action.payload,
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading.post = false;
      state.isAuthenticated = true;
      state.errors = initialState.errors;
      state.success = true;
    });
    builder.addCase(loginUser.pending, (state, _) => {
      state.loading.post = true;
      state.success = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading.post = false;
      state.isAuthenticated = false;
      state.errors = action.payload;
      state.success = false;
      state.user = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading.post = false;
      state.errors = initialState.errors;
      state.success = true;
    });
    builder.addCase(registerUser.pending, (state, _) => {
      state.loading.post = true;
      state.success = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading.post = false;
      state.errors = action.payload;
      state.success = false;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.loading.post = false;
      state.success = true;
      state.errors = initialState.errors;
      state.isAuthenticated = true;
      state.user = {
        ...action.payload,
      };
      AuthStorageService.setStorageData({
        user: JSON.stringify(state.user),
      });
    });
    builder.addCase(fetchUserData.pending, (state, _) => {
      state.loading.post = true;
      state.success = false;
    });
    builder.addCase(forgotUserPassword.fulfilled, (state, _) => {
      state.loading.post = false;
      state.success = true;
      state.errors = initialState.errors;
    });
    builder.addCase(forgotUserPassword.pending, (state, _) => {
      state.loading.post = true;
      state.success = false;
    });
    builder.addCase(forgotUserPassword.rejected, (state, action) => {
      state.loading.post = false;
      state.success = false;
      state.errors = action.payload;
    });
    builder.addCase(forgotUserPasswordConfirm.fulfilled, (state, _) => {
      state.loading.post = false;
      state.success = true;
      state.errors = initialState.errors;
    });
    builder.addCase(forgotUserPasswordConfirm.pending, (state, _) => {
      state.loading.post = true;
      state.success = false;
    });
    builder.addCase(forgotUserPasswordConfirm.rejected, (state, action) => {
      state.loading.post = false;
      state.success = false;
      state.errors = action.payload;
    });

    builder.addCase(fetchUserSubscribedCourses.fulfilled, (state, action) => {
      state.loading.detail = false;
      state.success = true;
      state.errors = initialState.errors;
      const user_profile_courses = action.payload;
      CourseStorageService.setStorageData({
        courses: JSON.stringify(user_profile_courses),
      });
      state.user_subscribed_courses = user_profile_courses;
    });
    builder.addCase(fetchUserSubscribedCourses.pending, (state, action) => {
      state.loading.detail = true;
      state.success = false;
    });
    builder.addCase(fetchUserSubscribedCourses.rejected, (state, action) => {
      state.loading.detail = false;
      state.success = false;
      state.errors = action.payload;
    });
  },
});

export default authSlice.reducer;
export const { logout, setUserProfileCourses } = authSlice.actions;
