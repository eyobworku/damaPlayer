import { configureStore } from "@reduxjs/toolkit";
import korkiReducer from "./korki/korkiSlice";
import eftaReducer from "./efta/eftaSlice";
export const store = configureStore({
  reducer: {
    korki: korkiReducer,
    efta: eftaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
