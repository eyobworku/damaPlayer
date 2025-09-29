import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Efta } from "../../types/efta";
const initialState: Efta = {
  prevKorkiState: [],
  doesEat: false,
  hasTaken: false,
};

const eftaSlice = createSlice({
  name: "efta",
  initialState,
  reducers: {
    setEftaLatest: (
      state,
      action: PayloadAction<{ newEfta: Efta; firstId: number }>
    ) => {
      const { newEfta, firstId } = action.payload;
      if (newEfta.prevKorkiState.length === 32) {
        const newState: Efta = { ...state };
        newState.prevKorkiState = [...newEfta.prevKorkiState];
        newState.prevKorkiState[firstId] = {
          ...newState.prevKorkiState[firstId],
          selected: 0,
        };
        newState.doesEat = newEfta.doesEat;
        newState.hasTaken = newEfta.hasTaken;
        return newState;
      }
    },
    setHasTaken: (state, action: PayloadAction<boolean>) => {
      state.hasTaken = action.payload;
    },
  },
});

export const { setEftaLatest, setHasTaken } = eftaSlice.actions;
export default eftaSlice.reducer;
