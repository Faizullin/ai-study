import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { ILoadingState } from "@/core/models/ILoadingState";
import { IDocument } from "@/core/models/IDocument";
import MLSearchService from "@/core/services/MLSearchService";
import { ICourse } from "@/core/models/ICourse";
import { ISubject } from "@/core/models/ISubject";
import { RootState } from "../store";

interface IFilterData {
  search: string;
  course?: ICourse;
  subjects?: ISubject[];
}

interface ISearchInitialState {
  documentsContentBased: IDocument[];
  documentsCollaborativeFiltered: IDocument[];
  pagination_data: {
    totalItems: number;
  };
  filter_data: IFilterData;
  loading: ILoadingState;
  errors: any;
  success: boolean;
}

const initialState: ISearchInitialState = {
  documentsContentBased: [],
  documentsCollaborativeFiltered: [],
  pagination_data: {
    totalItems: 0,
  },
  filter_data: {
    search: "",
  },
  loading: {
    list: false,
    detail: false,
  },
  errors: {},
  success: false,
};

const getFiltersData = (initital_data: IFilterData, additional: any = {}) => {
  const ddata: any = {};
  if (initital_data.search) {
    ddata.search = initital_data.search;
  }
  if (initital_data.course) {
    ddata.course = initital_data.course.id;
  }
  if (initital_data.subjects) {
    ddata.subjects = initital_data.subjects.map((item) => item.id)[0];
  }
  return {
    ...ddata,
    ...additional,
  };
};

export const fetchMlSearchContentBasedList = createAsyncThunk(
  "mlSearchSlice/fetchMlSearchContentBasedList",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await MLSearchService.getContentBasedML(id);
      return response.data;
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const fetchMlSearchCollaborativeFilteredList = createAsyncThunk(
  "mlSearchSlice/fetchMlSearchCollaborativeFilteredList",
  async (params: unknown, { rejectWithValue, getState }) => {
    try {
      const { filter_data } = (getState() as RootState).document;
      const response = await MLSearchService.getCollaborativeFilteredML(
        getFiltersData(filter_data, params)
      );
      return response.data;
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

const mlSearchSlice = createSlice({
  name: "mlSearch",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchMlSearchContentBasedList.fulfilled,
      (state, { payload }) => {
        state.loading.list = false;
        state.documentsContentBased = payload.results;
        state.pagination_data.totalItems = payload.count;
        state.errors = initialState.errors;
        state.success = true;
      }
    );
    builder.addCase(fetchMlSearchContentBasedList.pending, (state, _) => {
      state.loading.list = true;
      state.success = false;
    });
    builder.addCase(
      fetchMlSearchContentBasedList.rejected,
      (state, { payload }) => {
        state.loading.list = false;
        state.documentsContentBased = [];
        state.pagination_data.totalItems = 0;
        state.errors = payload;
        state.success = false;
      }
    );
    builder.addCase(
      fetchMlSearchCollaborativeFilteredList.fulfilled,
      (state, { payload }) => {
        state.loading.list = false;
        state.documentsCollaborativeFiltered = payload.results;
        state.pagination_data.totalItems = payload.count;
        state.errors = initialState.errors;
        state.success = true;
      }
    );
    builder.addCase(
      fetchMlSearchCollaborativeFilteredList.pending,
      (state, _) => {
        state.loading.list = true;
        state.success = false;
      }
    );
    builder.addCase(
      fetchMlSearchCollaborativeFilteredList.rejected,
      (state, { payload }) => {
        state.loading.list = false;
        state.documentsCollaborativeFiltered = [];
        state.pagination_data.totalItems = 0;
        state.errors = payload;
        state.success = false;
      }
    );
  },
});

export default mlSearchSlice.reducer;
