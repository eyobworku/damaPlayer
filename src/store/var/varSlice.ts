import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Korki } from "../../types/korki";

const initialState: { firstSelected: Korki | null; currentPlayer: number } = {
  firstSelected: null,
  currentPlayer: 1,
};
const varSlice = createSlice({
  name: "var",
  initialState,
  reducers: {
    setCurrentPlayer: (state, action: PayloadAction<number>) => {
      state.currentPlayer = action.payload;
    },
    setFirstSelected: (state, action: PayloadAction<Korki | null>) => {
      state.firstSelected = action.payload;
    },
  },
});
export const { setCurrentPlayer, setFirstSelected } = varSlice.actions;
export default varSlice.reducer;
