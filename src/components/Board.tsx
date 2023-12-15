import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./SquareBox";
import useBoard, { SquareBoard } from "../hooks/useBoard";
import { useEffect, useState } from "react";
import useKorki, { Korki } from "../hooks/useKorki";

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
}

const Board = ({ checkEftaVar, offSelectEfta }: Props) => {
  const [korkiState, setKorkiState] = useState<Korki[]>(initialKorki);
  const [firstSelected, setFirstSelected] = useState<Korki | null>(null);
  const [eftaState, setEftaState] = useState<Efta>({
    prevKorkiState: korkiState,
    doesEat: false,
  });
  const [currentPlayer, setCurrentPlayer] = useState(2); //true = player 1

  useEffect(() => {
    setEftaState({ ...eftaState, prevKorkiState: korkiState });
  }, [korkiState]);

  const updateSquare = (korki: Korki) => {
    if (firstSelected === null && korki.type === 3) {
      return;
    }

    if (firstSelected === null) {
      //check currebt player order
      if (korki.type === currentPlayer && !checkEftaVar) {
        return;
      }
      setKorkiState(
        korkiState.map((k) =>
          k.customKey === korki.customKey ? { ...k, selected: 1 } : k
        )
      );
      setFirstSelected(korki);
    } else if (firstSelected.customKey === korki.customKey) {
      setKorkiState(
        korkiState.map((k) =>
          k.customKey === firstSelected.customKey ? { ...k, selected: 0 } : k
        )
      );
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
      //check ongoing movement
      if (firstType.selected === 2) {
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          korkiState
        );
        // console.log(firstType.customKey, newType.customKey);
        console.log(movable, eat, nigus);
        if (eat !== -1) {
          varMovable = movable;
          varEat = eat;
          varNigus = nigus;
        } else {
          setKorkiState(
            korkiState.map((k) =>
              k.id === firstType.id ? { ...k, selected: 0 } : k
            )
          );
          setFirstSelected(null);
        }
        secondMove = true;
      }

      //efta eating
      if (!eftaState.doesEat && checkEftaVar) {
        console.log("check...");
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
          setKorkiState(
            korkiState.map((k) => {
              if (k.id === korki.id) {
                return {
                  ...k,
                  type: firstType.type,
                  nigus: varNigus,
                  selected: varEat === -1 ? 0 : 2,
                }; // Update the type of the clicked Korki to firstSelected's type
              } else if (k.id === firstSelected.id) {
                return {
                  ...k,
                  type: newType.type,
                  selected: 0,
                  nigus: false,
                }; // Update the type of the firstSelected Korki to clicked Korki's type
              } else if (k.id === varEat) {
                return { ...k, type: 3, selected: 0, nigus: false }; // Update the type of the firstSelected Korki to clicked Korki's type
              }
              return k;
            })
          );
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
          setKorkiState(
            korkiState.map((k) => {
              if (k.id === firstSelected.id) {
                return { ...k, type: 3, selected: 0, nigus: false }; // eat the efta
              }
              return k;
            })
          );
          setFirstSelected(null);
        }
        setEftaState({ ...eftaState, doesEat: varEat !== -1 ? true : false });
      } else {
        setKorkiState(
          korkiState.map((k) =>
            k.customKey === firstSelected.customKey ? { ...k, selected: 0 } : k
          )
        );
        setFirstSelected(null);
      }
    }
  };
  // const updateKorkiState = (firstSelected:Korki,korki:Korki,korkiState:Korki[])=>{}

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
    // console.log(diagId);
    // nigus moves
    if (firstType.nigus) {
      return findOtherTypeKorkiId(diagId, firstType.type, korkiState);
    }

    //Backward
    if (firstType.type === 2 && dir.startsWith("down")) {
      // console.log("Down Back");
      backWard = true;
      if (diagId.length === 2) {
        eat =
          korkiState[diagId[0]].type === 1 && korkiState[diagId[1]].type === 3
            ? diagId[0]
            : -1;
        movable = eat === -1 ? false : true;
      }
    } else if (firstType.type === 1 && dir.startsWith("up")) {
      // console.log("Up Back");
      backWard = true;
      if (diagId.length === 2) {
        eat =
          korkiState[diagId[0]].type === 2 && korkiState[diagId[1]].type === 3
            ? diagId[0]
            : -1;
        movable = eat === -1 ? false : true;
      }
    }

    //forward movement
    if (diagId.length === 2 && !backWard) {
      if (
        korkiState[diagId[0]].type !== firstType.type &&
        korkiState[diagId[0]].type !== 3
      ) {
        eat = korkiState[diagId[1]].type === 3 ? diagId[0] : -1;
        movable = eat === -1 ? false : true;
        // console.log(movable, eat);
      } else {
        movable = false;
      }
    } else if (diagId.length === 1 && !backWard) {
      movable = korkiState[diagId[0]].type === 3 && firstType.selected !== 2;
    }

    //check if it can be nigus
    nigus =
      (firstType.type === 1 && newType.x === 7) ||
      (firstType.type === 2 && newType.x === 0)
        ? true
        : false; // firstType.nigus === true ? true :
    return { movable, eat, nigus };
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
