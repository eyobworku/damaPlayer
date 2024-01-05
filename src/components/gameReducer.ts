import { Korki } from "../hooks/useKorki";

type Action = 
  | { type: 'UPDATE_KORKI_STATE'; korkiId: number; firstId: number; korkiType: number; firstType: number; varEat: number; varNigus: boolean }
  | { type: 'SET_TYPE_AND_SELECTED'; selectID: number; selectType?: number,setSelected?:number }
  | { type: 'EAT_EFTA'; eftaKorkiId: number }

const gameReducer = (state: Korki[], action: Action): Korki[] => {
  switch (action.type) {
    case 'UPDATE_KORKI_STATE':
      const { korkiId, firstId, korkiType, firstType, varEat, varNigus } = action;
      return state.map((k) => {
        if (k.id === korkiId) {
          return {
            ...k,
            type: firstType,
            nigus: varNigus,
            selected: varEat === -1 ? 0 : 2,
          };
        } else if (k.id === firstId) {
          return {
            ...k,
            type: korkiType,
            selected: 0,
            nigus: false,
          };
        } else if (k.id === varEat) {
          return {
            ...k,
            type: 3,
            selected: 0,
            nigus: false,
          };
        }
        return k;
      });

    case 'SET_TYPE_AND_SELECTED':
      const {  selectID, selectType,setSelected } = action;
      return state.map((k) => {
        if (k.id === selectID) {
          return {
            ...k,
            selected: setSelected!== undefined ?setSelected:k.selected, 
            type: selectType!== undefined ?selectType:k.type ,           
          };
        }
        return k;
      });

    case 'EAT_EFTA':
      const { eftaKorkiId } = action;
      return state.map((k) => {
        if (k.id === eftaKorkiId) {
          return {
            ...k,
            type: 3, // Assuming type 3 represents eating EFTA
            selected: 0,
            nigus: false,
            // Update other properties if needed
          };
        }
        return k;
      });

    default:
      return state;
  }
};

export default gameReducer;
