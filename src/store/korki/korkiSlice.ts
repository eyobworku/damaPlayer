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
      action: PayloadAction<{ latestKorki: Korki[]; eatKorkId: number }>
    ) => {
      const { latestKorki, eatKorkId } = action.payload;
      let x1 = -1;
      let x2 = -1;
      for (let i = 0; i < latestKorki.length; i++) {
        if (latestKorki[i].type !== state[i].type) {
          if (x1 === -1) {
            x1 = i;
          } else if (x2 === -1) {
            x2 = i;
          }
        }
      }

      if (eatKorkId !== -1) {
        const index = eatKorkId;
        state[index].type = 3;
        state[index].nigus = false;
        state[index].selected = 0;
        if (eatKorkId !== x1 && eatKorkId !== x2) {
          console.log(x1, x2);

          state[x1].type = latestKorki[x1].type;
          state[x1].nigus = latestKorki[x1].nigus;
          state[x1].selected = 0;

          state[x2].type = latestKorki[x2].type;
          state[x2].nigus = latestKorki[x2].nigus;
          state[x2].selected = 0;
        }
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
