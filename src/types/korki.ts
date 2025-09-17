interface Korki {
  id: number;
  play: boolean;
  type: number;
  customKey: string;
  selected: number;
  nigus: boolean;
}
interface ExtendedKorki extends Korki {
  x: number;
  y: number;
}
export type { Korki, ExtendedKorki };
