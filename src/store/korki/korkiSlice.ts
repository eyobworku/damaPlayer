import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import useKorki, { Korki } from "../../hooks/useKorki";
const initialState: Korki[] = useKorki();

const korkiSlice = createSlice({
  name: "korki",
  initialState,
  reducers: {
    updateKorkiState: (
      state,
      action: PayloadAction<{
        korki: Korki;
        first: Korki;
        varEat: number;
        varNigus: boolean;
      }>
    ) => {
      const { korki, first, varEat, varNigus } = action.payload;
      if (state.length == 32) {
        let index = first.id;
        state[index].type = korki.type;
        state[index].nigus = false;
        state[index].selected = 0;

        index = korki.id;
        state[index].type = first.type;
        state[index].nigus = varNigus;
        state[index].selected = varEat === -1 ? 0 : 2;

        if (varEat !== -1) {
          index = varEat;
          state[index].type = 3;
          state[index].nigus = false;
          state[index].selected = 0;
        }
      }
    },
    setTypeAndSelected: (
      state,
      action: PayloadAction<{
        selectID: number;
        selectType?: number;
        setSelected?: number;
      }>
    ) => {
      const { selectID, selectType, setSelected } = action.payload;
      const updateKorki = state.find((k) => k.id === selectID);
      if (updateKorki) {
        const index = state.indexOf(updateKorki);
        state[index].type =
          selectType !== undefined ? selectType : state[index].type;
        state[index].selected =
          setSelected !== undefined ? setSelected : state[index].selected;
      }
    },
    eatEftaById: (state, action: PayloadAction<number>) => {
      const eatKorki = state.find((k) => k.id === action.payload);
      if (eatKorki) {
        const index = state.indexOf(eatKorki);
        state[index].type = 3;
        state[index].nigus = false;
        state[index].selected = 0;
      }
    },
    updateKorki: (_state, action: PayloadAction<Korki[]>) => {
      return action.payload;
    },
  },
});

export const {
  updateKorkiState,
  setTypeAndSelected,
  eatEftaById,
  updateKorki,
} = korkiSlice.actions;
export default korkiSlice.reducer;
