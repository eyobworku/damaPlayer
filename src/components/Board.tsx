import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./SquareBox";
import useBoard, { SquareBoard } from "../hooks/useBoard";
import { useEffect, useState } from "react";
import useKorki, { Korki } from "../hooks/useKorki";

export interface GameBoard {
  winner: string;
  squares: SquareBoard[][];
}

let initialSquares: SquareBoard[][] = useBoard();
const initialKorki: Korki[] = useKorki();

const Board = () => {
  const [boardState, setBoardState] = useState<GameBoard>({
    winner: "",
    squares: initialSquares,
  });
  const [korkiState, setKorkiState] = useState<Korki[]>(initialKorki);
  const [firstSelected, setFirstSelected] = useState("none");
  const updateSquare = (customKey: string) => {
    if (firstSelected === "none") {
      updateSquareData(customKey, undefined, true);
      setFirstSelected(customKey);
    } else if (firstSelected === customKey) {
      updateSquareData(customKey, undefined, false);
      setFirstSelected("none");
      const updatedKorkiState = korkiState.map((korki) => {
        if (korki.customKey === customKey) {
          return { ...korki, type: 3 };
        }
        return korki;
      });
      setKorkiState(updatedKorkiState);
    } else {
      updateSquareData(firstSelected, undefined, false);
      updateSquareData(customKey, undefined, true);
      setFirstSelected(customKey);
    }
  };

  const updateSquareData = (
    customKey: string,
    typeOfBoard?: number,
    selected?: boolean
  ) => {
    setBoardState((prevState) => {
      const updatedSquares = [...prevState.squares]; // Create a copy of the squares array

      const rowIndex = parseInt(customKey.charAt(0));
      const colIndex = parseInt(customKey.charAt(1));

      updatedSquares[rowIndex][colIndex] = {
        ...updatedSquares[rowIndex][colIndex],
        typeOfBoard:
          typeOfBoard !== undefined
            ? typeOfBoard
            : updatedSquares[rowIndex][colIndex].typeOfBoard,
        selected:
          selected !== undefined
            ? selected
            : updatedSquares[rowIndex][colIndex].selected,
      };
      return { ...prevState, squares: updatedSquares };
    });
  };
  const renderKorki = () => {
    for (let i = 0; i < korkiState.length; i++) {
      updateSquareData(korkiState[i].customKey, korkiState[i].type, undefined);
    }
  };
  const renderBoard = () => {
    const rows: JSX.Element[] = [];

    for (let i = 0; i < 8; i++) {
      const rowElements: JSX.Element[] = [];
      for (let j = 0; j < 8; j++) {
        rowElements.push(
          <SquareBox
            key={`${i}${j}`}
            customKey={`${i}${j}`}
            selected={boardState.squares[i][j].selected}
            typeOfBox={boardState.squares[i][j].typeOfBoard}
            onSelectSquare={(customKey) => {
              updateSquare(customKey);
            }}
          />
        );
      }
      rows.push(<Flex key={i}>{rowElements}</Flex>);
    }
    return rows;
  };
  useEffect(() => {
    renderKorki();
  }, [korkiState]);

  return (
    <Box p={5}>
      <Center>
        <Box>{renderBoard()}</Box>
      </Center>
    </Box>
  );
};

export default Board;
