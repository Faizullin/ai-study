import { configureStore } from "@reduxjs/toolkit";
import mlSearchSlice from "./reducers/mlSearchSlice";
import documentSlice from "./reducers/documentSlice";
import modalSlice from "./reducers/modalSlice";
import authSlice from "./reducers/authSlice";
import userSlice from "./reducers/userSlice";
import notificationSlice from "./reducers/notificationSlice";
import searchSidebarSlice from "./reducers/searchSidebarSlice";
import filterSlice from "./reducers/filterSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    modal: modalSlice,
    notification: notificationSlice,
    document: documentSlice,
    mlSearch: mlSearchSlice,
    searchSidebar: searchSidebarSlice,
    filter: filterSlice,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
