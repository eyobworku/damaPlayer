import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import useKorki from "../../hooks/useKorki";
import { Korki } from "../../types/korki";
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
    eatEftaById: (
      state,
      action: PayloadAction<{
        index: number;
        x1: number;
        x2: number;
        interChange: boolean;
        x1Korki: Korki | null;
        x2Korki: Korki | null;
      }>
    ) => {
      // console.log(action.payload);
      const { index, x1, x2, interChange, x1Korki, x2Korki } = action.payload;
      state[index].type = 3;
      state[index].nigus = false;
      state[index].selected = 0;
      if (interChange && x1 !== -1 && x2 !== -1 && x1Korki && x2Korki) {
        state[x1].type = x1Korki?.type;
        state[x1].nigus = x1Korki?.nigus;
        state[x1].selected = 0;

        state[x2].type = x2Korki?.type;
        state[x2].nigus = x2Korki?.nigus;
        state[x2].selected = 0;
      } else if (!interChange && x1 !== -1 && x2 !== -1) {
        state[x1].type = 3;
        state[x1].nigus = false;
        state[x1].selected = 0;

        state[x2].type = 3;
        state[x2].nigus = false;
        state[x2].selected = 0;
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
