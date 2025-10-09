import { Korki } from "./korki";
interface Efta {
  prevKorkiState: Korki[];
  doesEat: boolean;
  hasTaken: boolean;
  checkEfta: boolean;
}
type EftaWithoutHasTaken = Omit<Efta, "hasTaken">;

export type { Efta, EftaWithoutHasTaken };
