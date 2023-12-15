import { Korki } from "./useKorki";

export interface SquareBoard {
    typeOfBoard: boolean;
    korki: Korki | null;
}
const useBoard = () => {
    let initialSquares: SquareBoard[][] = [];
    for (let i = 0; i < 8; i++) {
        let row: SquareBoard[] = [];
        for (let j = 0; j < 8; j++) {
            if((i + j) % 2 === 0){
                row.push({ typeOfBoard:true, korki:null});
            }else{
                row.push({ typeOfBoard:false, korki:null});
            }
        }
        initialSquares.push(row);
    }

    return initialSquares;
};

export default useBoard;
