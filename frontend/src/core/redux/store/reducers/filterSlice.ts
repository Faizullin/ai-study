import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { ILoadingState } from "@/core/models/ILoadingState";
import { ICourse } from "@/core/models/ICourse";
import { ISubject } from "@/core/models/ISubject";
import FilterService from "@/core/services/FilterService";

export interface IDocumentFilterData {
  search: string;
  course: ICourse | null;
  subjects: ISubject[];
  subscribed?: boolean;
}

interface IFilterDataInitialState {
  filter_data: IDocumentFilterData;
  courses: ICourse[];
  subjects: ISubject[];
  loading: ILoadingState;
  errors: any;
  success: boolean;
}

const initialState: IFilterDataInitialState = {
  filter_data: {
    course: null,
    subjects: [],
    search: "",
    subscribed: undefined,
  },
  courses: [],
  subjects: [],
  loading: {
    list: false,
    detail: false,
  },
  errors: {},
  success: false,
};

export const getFiltersData = (
  initital_data: IDocumentFilterData,
  additional: any = {}
) => {
  const ddata: any = {};
  if (initital_data.search) {
    ddata.search = initital_data.search;
  }
  if (initital_data.course) {
    ddata.course = initital_data.course.id;
  }
  if (initital_data.subjects?.length > 0) {
    ddata.subjects = initital_data.subjects.map((item) => item.id).join(",");
  }
  if (initital_data.subscribed !== undefined) {
    ddata.subscribed = initital_data.subscribed;
  }
  return {
    ...ddata,
    ...additional,
  };
};

export const fetchCourseList = createAsyncThunk(
  "document/fetchCourseList",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await FilterService.getCourses(params);
      return response.data;
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const fetchSubjectList = createAsyncThunk(
  "document/fetchSubjectList",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await FilterService.getSubjects(params);
      return response.data;
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterData(state, action) {
      state.filter_data = { ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCourseList.fulfilled, (state, { payload }) => {
      state.loading.list = false;
      state.errors = initialState.errors;
      state.success = true;
      state.courses = payload;
    });
    builder.addCase(fetchCourseList.pending, (state, _) => {
      state.loading.list = true;
      state.success = false;
    });
    builder.addCase(fetchCourseList.rejected, (state, { payload }) => {
      state.loading.list = false;
      state.errors = payload;
      state.success = false;
    });
    builder.addCase(fetchSubjectList.fulfilled, (state, { payload }) => {
      state.loading.detail = false;
      state.success = true;
      state.errors = initialState.errors;
      state.subjects = payload;
    });
    builder.addCase(fetchSubjectList.pending, (state, _) => {
      state.loading.detail = true;
      state.success = false;
    });
    builder.addCase(fetchSubjectList.rejected, (state, { payload }) => {
      state.loading.detail = false;
      state.errors = payload;
      state.success = false;
    });
  },
});

export default filterSlice.reducer;

export const { setFilterData } = filterSlice.actions;
