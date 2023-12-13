import { Korki } from "./useKorki";

export interface SquareBoard {
    typeOfBoard: number;
    korki: Korki | null;
}
const useBoard = () => {
    let initialSquares: SquareBoard[][] = [];
    for (let i = 0; i < 8; i++) {
        let row: SquareBoard[] = [];
        for (let j = 0; j < 8; j++) {
            if((i + j) % 2 === 0){
                row.push({ typeOfBoard:3, korki:null});
            }else{
                row.push({ typeOfBoard:0, korki:null});
            }
        }
        initialSquares.push(row);
    }

    return initialSquares;
};

export default useBoard;
