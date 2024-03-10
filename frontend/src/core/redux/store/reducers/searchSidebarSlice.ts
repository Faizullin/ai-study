import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { ILoadingState } from "@/core/models/ILoadingState";
import { IDocument } from "@/core/models/IDocument";
import DocumentService from "@/core/services/DocumentService";
import { RootState } from "../store";

interface ISearchInitialState {
  isHeaderSearchBarOpen: boolean;
  pagination_data: {
    totalItems: number;
  };
  filter_data: {
    search: string;
    [key: string]: string | Array<string>;
  };
  documents: IDocument[];
  loading: ILoadingState;
  errors: any;
  success: boolean;
}

const initialState: ISearchInitialState = {
  isHeaderSearchBarOpen: false,
  documents: [],
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

const getFiltersData = (initital_data: any, additional: any = {}) => {
  const ddata: any = {};
  if (initital_data.search) {
    ddata.search = initital_data.search;
  }
  // if (initital_data.pagination_data.page) {
  //   ddata.page = initital_data.pagination_data.page;
  //   ddata.page_size = initital_data.pagination_data.page_size;
  // }
  return {
    ...ddata,
    ...additional,
  };
};

export const fetchDocumentList = createAsyncThunk(
  "searchSidebar/fetchDocumentList",
  async (params: any, { rejectWithValue, getState }) => {
    try {
      const { filter_data } = (getState() as RootState).searchSidebar;
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

const searchSidebarSlice = createSlice({
  name: "searchSidebar",
  initialState,
  reducers: {
    openHeaderSearchbar(state) {
      state.isHeaderSearchBarOpen = true;
    },
    closeHeaderSearchbar(state) {
      state.isHeaderSearchBarOpen = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchDocumentList.fulfilled, (state, { payload }) => {
      state.loading.list = false;
      state.documents = payload.results;
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
  },
});

export default searchSidebarSlice.reducer;
export const { openHeaderSearchbar, closeHeaderSearchbar } =
  searchSidebarSlice.actions;
