export interface SquareBoard {
    typeOfBoard: number;
    key: string;
    selected:boolean
}
const useBoard = () => {
    let initialSquares: SquareBoard[][] = [];
    for (let i = 0; i < 8; i++) {
        let row: SquareBoard[] = [];
        for (let j = 0; j < 8; j++) {
            const key = `${i}${j}`;
            let typeOfBoard;
            if((i + j) % 2 === 0){
                // typeOfBoard = (i < 3) ? 1 : (i > 4) ? 2 : 3;
                typeOfBoard = 3;
            }else{
                typeOfBoard = 0;
            }

            row.push({ typeOfBoard, key,selected:false });
        }
        initialSquares.push(row);
    }

    return initialSquares;
};

export default useBoard;
