import { createSlice } from "@reduxjs/toolkit";

interface IModaData {
  id: string;
  open: boolean;
  props: any;
}

interface IInitialState {
  modals: Array<IModaData>;
}
const initialState: IInitialState = {
  modals: [],
};

export const modalIds = {
  searchPopup: "search-sidebar",
  detailModal: "detail-modal",
  documentItemDetailPopup: "document-item-detail-popup",
  loginRequiredPopup: "login-required-popup",
};

Object.keys(modalIds).forEach((key) => {
  initialState.modals.push({
    id: modalIds[key],
    props: {},
    open: false,
  });
});

export const getModalDataById = (modals: IModaData[], id: string) => {
  const foundId = modals.findIndex((item) => item.id === id);
  if (foundId === -1) {
    throw new Error(`Modal with id: ${id} not found`);
  }
  return modals[foundId];
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { id, props, closeOther } = action.payload;
      const modalData = getModalDataById(state.modals, id);
      if (modalData && closeOther) {
        for (let index = 0; index < state.modals.length; index++) {
          if (id !== modalData.id) {
            state.modals[index].open = false;
          }
        }
      }
      modalData.open = true;
      modalData.props = props;
    },
    closeModal: (state, action) => {
      const { id, closeOther } = action.payload;
      const modalData = getModalDataById(state.modals, id);
      if (modalData && closeOther) {
        for (let index = 0; index < state.modals.length; index++) {
          if (id !== modalData.id) {
            state.modals[index].open = false;
          }
        }
      }
      modalData.open = false;
    },
  },
});

export default modalSlice.reducer;

export const { openModal, closeModal } = modalSlice.actions;
