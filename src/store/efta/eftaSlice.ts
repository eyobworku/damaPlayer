import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Korki } from "../../hooks/useKorki";

interface Efta {
  prevKorkiState: Korki[];
  doesEat: boolean;
}

const initialState: Efta = { prevKorkiState: [], doesEat: false };

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
        newState.prevKorkiState = { ...newEfta.prevKorkiState };
        newState.prevKorkiState[firstId] = {
          ...newState.prevKorkiState[firstId],
          selected: 0,
        };
        newState.doesEat = newEfta.doesEat;
        return newState;
      }
    },
  },
});

export const { setEftaLatest } = eftaSlice.actions;
export default eftaSlice.reducer;
