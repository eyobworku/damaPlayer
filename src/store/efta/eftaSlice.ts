import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Efta } from "../../types/efta";
const initialState: Efta = {
  prevKorkiState: [],
  doesEat: false,
  hasTaken: false,
  checkEfta: false,
};

const eftaSlice = createSlice({
  name: "efta",
  initialState,
  reducers: {
    setEftaLatest: (
      state,
      action: PayloadAction<{
        newEfta: Omit<Efta, "checkEfta">;
        firstId: number;
      }>
    ) => {
      const { newEfta, firstId } = action.payload;
      const newState: Efta = {
        ...state,
        prevKorkiState: [...state.prevKorkiState],
      };
      if (newEfta.prevKorkiState.length === 32) {
        newState.prevKorkiState = newEfta.prevKorkiState.map((k, idx) =>
          idx === firstId ? { ...k, selected: 0 } : k
        );
        newState.doesEat = newEfta.doesEat;
        newState.hasTaken = newEfta.hasTaken;
      }
      return newState;
    },
    setHasTaken: (state, action: PayloadAction<boolean>) => {
      state.hasTaken = action.payload;
    },
    setCheckEfta: (state, action: PayloadAction<boolean>) => {
      state.checkEfta = action.payload;
    },
  },
});

export const { setEftaLatest, setHasTaken, setCheckEfta } = eftaSlice.actions;
export default eftaSlice.reducer;
