import { configureStore } from "@reduxjs/toolkit";
import korkiReducer from "./korki/korkiSlice";
import eftaReducer from "./efta/eftaSlice";
import varReducer from "./var/varSlice";
import onlineReducer from "./online/onlineSlice";
export const store = configureStore({
  reducer: {
    korki: korkiReducer,
    efta: eftaReducer,
    var: varReducer,
    online: onlineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
