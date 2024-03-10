import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IDocument } from "@/core/models/IDocument";
import { ILoadingState } from "@/core/models/ILoadingState";
import DocumentService from "@/core/services/DocumentService";
import { RootState } from "../store";
import { ICourse } from "@/core/models/ICourse";
import { ISubject } from "@/core/models/ISubject";

interface IFilterData {
  search: string;
  course?: ICourse;
  subjects?: ISubject[];
}

interface IInitialState {
  documents: IDocument[];
  pagination_data: {
    totalItems: number;
  };
  filter_data: IFilterData;
  document_payload: IDocument | null;
  loading: ILoadingState;
  errors: any;
  success: boolean;
}

const initialState: IInitialState = {
  documents: [],
  pagination_data: {
    totalItems: 0,
  },
  filter_data: {
    search: "",
  },
  document_payload: null,
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

export const fetchDocumentList = createAsyncThunk(
  "document/fetchDocumentList",
  async (params: any, { rejectWithValue, getState }) => {
    try {
      const { filter_data } = (getState() as RootState).document;
      const response = await DocumentService.getAll(
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

export const fetchDocumentDetail = createAsyncThunk(
  "document/fetchDocumentDetail",
  async (item_id: number, { rejectWithValue }) => {
    try {
      const response = await DocumentService.getById(item_id);
      return {
        ...response.data,
      };
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const fetchDocumentRate = createAsyncThunk(
  "document/fetchDocumentRate",
  async (
    { item_id, value }: { item_id: number; value: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await DocumentService.rateDocument(item_id, value);
      return {
        ...response.data,
      };
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocument(state, action) {
      state.document_payload = { ...action.payload };
    },
    setFilterData(state, action) {
      state.filter_data = { ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchDocumentList.fulfilled, (state, { payload }) => {
      state.loading.list = false;
      state.documents = payload.results;
      state.pagination_data.totalItems = payload.count;
      state.errors = initialState.errors;
      state.success = true;
    });
    builder.addCase(fetchDocumentList.pending, (state, _) => {
      state.loading.list = true;
      state.success = false;
    });
    builder.addCase(fetchDocumentList.rejected, (state, { payload }) => {
      state.loading.list = false;
      state.documents = [];
      state.errors = payload;
      state.success = false;
    });
    builder.addCase(fetchDocumentDetail.fulfilled, (state, { payload }) => {
      state.loading.detail = false;
      state.success = true;
      state.document_payload = payload;
      state.errors = initialState.errors;
    });
    builder.addCase(fetchDocumentDetail.pending, (state, _) => {
      state.loading.detail = true;
      state.success = false;
    });
    builder.addCase(fetchDocumentDetail.rejected, (state, { payload }) => {
      state.loading.detail = false;
      state.errors = payload;
      state.success = false;
    });
    builder.addCase(fetchDocumentRate.fulfilled, (state, { payload }) => {
      state.loading.post = false;
      state.success = true;
      state.errors = initialState.errors;
      if (state.document_payload) {
        state.document_payload = {
          ...state.document_payload,
          my_rating_value: payload.value || 0,
        };
      }
    });
    builder.addCase(fetchDocumentRate.pending, (state, _) => {
      state.loading.post = true;
      state.success = false;
    });
    builder.addCase(fetchDocumentRate.rejected, (state, { payload }) => {
      state.loading.post = false;
      state.errors = payload;
      state.success = false;
    });
  },
});

export default documentSlice.reducer;

export const { setDocument, setFilterData } = documentSlice.actions;
