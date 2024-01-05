import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./SquareBox";
import useBoard, { SquareBoard } from "../hooks/useBoard";
import { useEffect, useReducer, useState } from "react";
import useKorki, { Korki } from "../hooks/useKorki";
import gameReducer from "./gameReducer";

export interface GameBoard {
  winner: string;
  squares: SquareBoard[][];
}
interface ExtendedKorki extends Korki {
  x: number;
  y: number;
}
interface Efta {
  prevKorkiState: Korki[];
  doesEat: boolean;
}
//type 1 fanta down / 2 coka up
// for(let i=0;i<8;i++){ let row = []
//   for(let j=0;j<8;j++){ row.push(`${i}${j}`)}console.log(row)}

const initialKorki: Korki[] = useKorki();
const initialSquares: SquareBoard[][] = useBoard();
interface Props {
  checkEftaVar: boolean;
  offSelectEfta: () => void;
  updateCurentPlaying: (curPl: number) => void;
}

const Board = ({ checkEftaVar, offSelectEfta, updateCurentPlaying }: Props) => {
  // const [korkiState, setKorkiState] = useState<Korki[]>(initialKorki);
  const [korkiState, dispath] = useReducer(gameReducer, initialKorki);
  const [firstSelected, setFirstSelected] = useState<Korki | null>(null);
  const [eftaState, setEftaState] = useState<Efta>({
    prevKorkiState: korkiState,
    doesEat: false,
  });
  const [currentPlayer, setCurrentPlayer] = useState(2); //true = player 1

  useEffect(() => {
    setEftaState({ ...eftaState, prevKorkiState: korkiState });
  }, [korkiState]);
  useEffect(() => {
    updateCurentPlaying(currentPlayer);
  }, [currentPlayer]);
  const updateSquare = (korki: Korki) => {
    if (firstSelected === null && korki.type === 3) {
      return;
    }

    if (firstSelected === null) {
      //check current player order
      if (checkEftaVar) {
        if (korki.type !== currentPlayer) {
          return;
        }
      }
      if (korki.type === currentPlayer && !checkEftaVar) {
        return;
      }
      dispath({
        type: "SET_TYPE_AND_SELECTED",
        selectID: korki.id,
        setSelected: 1,
      });
      setFirstSelected(korki);
    } else if (firstSelected.id === korki.id) {
      dispath({
        type: "SET_TYPE_AND_SELECTED",
        selectID: firstSelected.id,
        setSelected: 0,
      });

      setFirstSelected(null);
    } else {
      //main logic
      const firstType = {
        ...firstSelected,
        x: parseInt(firstSelected.customKey.charAt(0)),
        y: parseInt(firstSelected.customKey.charAt(1)),
      };
      const newType = {
        ...korki,
        x: parseInt(korki.customKey.charAt(0)),
        y: parseInt(korki.customKey.charAt(1)),
      };
      let varMovable = false;
      let eatEfta = false;
      let varEat = -1;
      let varNigus = false;
      let secondMove = false;

      //check ongoing movement / second move
      if (firstType.selected === 2) {
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          korkiState
        );
        if (eat !== -1) {
          varMovable = movable;
          varEat = eat;
          varNigus = nigus;
        } else {
          dispath({
            type: "SET_TYPE_AND_SELECTED",
            selectID: firstType.id,
            setSelected: 0,
          });
          setFirstSelected(null);
        }
        secondMove = true;
      }

      //efta eating
      if (!eftaState.doesEat && checkEftaVar) {
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          eftaState.prevKorkiState
        );
        if (eat !== -1) {
          eatEfta = true;
          varMovable = movable;
          varNigus = nigus;
        } else {
          varMovable = false;
        }

        offSelectEfta();
      } else if (!checkEftaVar && !secondMove) {
        //normal move checkpoint
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          korkiState
        );
        varMovable = movable;
        varEat = eat;
        varNigus = nigus;
      }

      if (varMovable) {
        if (!eatEfta) {
          dispath({
            type: "UPDATE_KORKI_STATE",
            korkiId: korki.id,
            korkiType: newType.type,
            firstId: firstSelected.id,
            firstType: firstType.type,
            varEat: varEat,
            varNigus: varNigus,
          });
          setCurrentPlayer(firstType.type);
          if (varEat === -1) {
            setFirstSelected(null);
          } else {
            //set firset selected to new type
            setFirstSelected({
              ...korkiState[korki.id],
              type: firstType.type,
              nigus: varNigus,
              selected: 2,
            });
          }
        } else if (eatEfta) {
          dispath({ type: "EAT_EFTA", eftaKorkiId: firstSelected.id });
          setFirstSelected(null);
        }
        setEftaState({ ...eftaState, doesEat: varEat !== -1 ? true : false });
      } else {
        dispath({
          type: "SET_TYPE_AND_SELECTED",
          selectID: firstSelected.id,
          setSelected: 0,
        });
        setFirstSelected(null);
      }
    }
  };

  const getDisDir = (firstType: ExtendedKorki, newType: ExtendedKorki) => {
    let dis = 0;
    let dir = "none";
    if (newType.x + newType.y === firstType.x + firstType.y) {
      dir = firstType.x > newType.x ? "upRight" : "downLeft";
      dis = Math.abs(firstType.x - newType.x);
    } else if (firstType.x - newType.x === firstType.y - newType.y) {
      dir = firstType.x > newType.x ? "upLeft" : "downRight";
      dis = Math.abs(firstType.x - newType.x);
    }
    return { dir, dis };
  };

  const checkEatable = (
    firstType: ExtendedKorki,
    newType: ExtendedKorki,
    korkiState: Korki[]
  ) => {
    let movable = false;
    let backWard = false;
    let nigus = false;
    let eat = -1;

    const { dir, dis } = getDisDir(firstType, newType);
    if (dir === "none" || newType.type !== 3) {
      return { movable, eat, nigus };
    }

    const diagId = moveableDirection(firstType.x, firstType.y, dir).splice(
      0,
      dis
    );

    // nigus moves
    if (firstType.nigus) {
      return findOtherTypeKorkiId(diagId, firstType.type, korkiState);
    }

    const { varBackWard, varMovable, varEat } = checkBackMove(
      firstType,
      diagId,
      korkiState,
      dir
    );
    backWard = varBackWard;
    movable = varMovable;
    eat = varEat;

    //forward movement and check nigus
    if (!backWard || diagId.length < 3) {
      if (diagId.length === 2) {
        if (
          korkiState[diagId[0]].type !== firstType.type &&
          korkiState[diagId[0]].type !== 3
        ) {
          eat = korkiState[diagId[1]].type === 3 ? diagId[0] : -1;
          movable = eat === -1 ? false : true;
        } else {
          movable = false;
        }
      } else if (diagId.length === 1) {
        movable = korkiState[diagId[0]].type === 3 && firstType.selected !== 2;
      }
      nigus =
        (firstType.type === 1 && newType.x === 7) ||
        (firstType.type === 2 && newType.x === 0)
          ? true
          : false; // firstType.nigus === true ? true :
    }

    return { movable, eat, nigus };
  };
  const checkBackMove = (
    firstType: ExtendedKorki,
    diagId: number[],
    korkiState: Korki[],
    dir: string
  ) => {
    let varBackWard = true;
    let varMovable = false;
    let varEat = -1;
    const direction = firstType.type === 1 ? "up" : "down";
    const opostion = firstType.type === 1 ? 2 : 1;

    if (dir.startsWith(direction)) {
      if (diagId.length === 2) {
        varEat =
          korkiState[diagId[0]].type === opostion &&
          korkiState[diagId[1]].type === 3
            ? diagId[0]
            : -1;
        varMovable = varEat === -1 ? false : true;
      }
    } else {
      varBackWard = false;
    }
    return { varBackWard, varMovable, varEat };
  };
  //nigus move check
  const findOtherTypeKorkiId = (
    diagId: number[],
    myType: number,
    korkiState: Korki[]
  ) => {
    let eat = -1;
    let typeTwoCount = 0;
    let movable = true;

    diagId.forEach((id) => {
      const korki = korkiState[id];
      if (korki.type !== myType || korki.type === 3) {
        if (korki.type !== 3) {
          if (typeTwoCount === 0) {
            eat = id;
            typeTwoCount++;
          } else {
            movable = false;
          }
        }
      } else {
        movable = false;
      }
    });

    return { movable, eat, nigus: true };
  };

  function moveableDirection(x: number, y: number, dir: string) {
    let newX = x;
    let newY = y;
    const diagId = [];
    while (
      (dir === "downLeft" && newX !== 7 && newY !== 0) ||
      (dir === "downRight" && newX !== 7 && newY !== 7) ||
      (dir === "upRight" && newX !== 0 && newY !== 7) ||
      (dir === "upLeft" && newX !== 0 && newY !== 0)
    ) {
      if (dir === "downLeft") {
        newX++;
        newY--;
      } else if (dir === "downRight") {
        newX++;
        newY++;
      } else if (dir === "upRight") {
        newX--;
        newY++;
      } else if (dir === "upLeft") {
        newX--;
        newY--;
      }

      diagId.push(getIdFromRowColumn(`${newX}${newY}`));
    }
    return diagId;
  }

  const getIdFromRowColumn = (customKey: string): number => {
    const row = Number(customKey[0]);
    const col = Number(customKey[1]);
    if (row >= 0 && row < 8 && col >= 0 && col < 8 && (row + col) % 2 === 0) {
      const id = Math.floor((row * 8 + col) / 2);
      return id;
    }
    return -1; // Return undefined for invalid row or column or if the condition doesn't match
  };

  const renderBoard = () => {
    const rows: JSX.Element[] = [];
    let id = 0;
    for (let i = 0; i < 8; i++) {
      const rowElements: JSX.Element[] = [];
      for (let j = 0; j < 8; j++) {
        const key = `${i}${j}`;
        rowElements.push(
          <SquareBox
            key={key}
            korki={initialSquares[i][j].typeOfBoard ? korkiState[id++] : null}
            onSelectSquare={(korki) => {
              updateSquare(korki);
            }}
          />
        );
      }
      rows.push(<Flex key={i}>{rowElements}</Flex>);
    }

    return rows;
  };

  return (
    <Box p={5}>
      <Center>
        <Box>{renderBoard()}</Box>
      </Center>
    </Box>
  );
};

export default Board;
