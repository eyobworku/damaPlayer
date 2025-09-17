import { Korki } from "../types/korki";

const useKorki = () => {
  const intialKorki: Korki[] = [];
  let id = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const key = `${i}${j}`;
      if ((i + j) % 2 === 0) {
        intialKorki.push({
          id: id++,
          customKey: key,
          play: false,
          type: i < 3 ? 1 : i > 4 ? 2 : 3,
          selected: 0,
          nigus: false,
        });
      }
    }
  }

  return intialKorki;
};
export default useKorki;
