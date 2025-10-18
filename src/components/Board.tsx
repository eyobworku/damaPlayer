import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./Board/SquareBox";
import useBoard, { SquareBoard } from "../hooks/useBoard";
import { useCallback, useEffect, useState } from "react";
import { Korki } from "../types/korki";
import { useDispatch } from "react-redux";
import {
  updateKorkiState,
  setTypeAndSelected,
  eatEftaById,
  updateKorki,
} from "../store/korki/korkiSlice";
import {
  setEftaLatest,
  setHasTaken,
  setCheckEfta,
} from "../store/efta/eftaSlice";
import { setFirstSelected, setCurrentPlayer } from "../store/var/varSlice";
import { setIsMyTurn } from "../store/online/onlineSlice";
import { checkEatable } from "../utils/board_functions";
import useGameState from "../hooks/useGameState";
import socket from "../utils/socket";
import useOnlineState from "../hooks/useOnlineState";

//type 1 fanta down / 2 coka up
// for(let i=0;i<8;i++){ let row = []
//   for(let j=0;j<8;j++){ row.push(`${i}${j}`)}console.log(row)}

const initialSquares: SquareBoard[][] = useBoard();

const Board = () => {
  const { online, playerId, isMyTurn } = useOnlineState();
  const { korkiState, firstSelected, eftaState, currentPlayer } =
    useGameState();
  const dispatch = useDispatch();
  const { prevKorkiState, checkEfta, hasTaken } = eftaState;
  const [latestKorki, setLatestKorki] = useState<Korki[]>([]);

  useEffect(() => {
    if (checkEfta && prevKorkiState.length === 32) {
      setLatestKorki(korkiState);
      dispatch(updateKorki(prevKorkiState));
    } else if (!checkEfta && latestKorki.length !== 0 && !hasTaken) {
      dispatch(updateKorki(latestKorki));
      setLatestKorki([]);
    }
  }, [checkEfta]);
  const eftaMovedKorki = useCallback(
    (takenId: number) => {
      let x1: number = -1;
      let x2: number = -1;
      for (let i = 0; i < latestKorki.length; i++) {
        if (latestKorki[i].type !== korkiState[i].type) {
          if (x1 === -1) {
            x1 = i;
          } else if (x2 === -1) {
            x2 = i;
          }
        }
      }
      console.log(x1, x2, latestKorki[x1], latestKorki[x2]);

      if (x1 !== -1 && x2 !== -1 && takenId !== x1 && takenId !== x2) {
        const interChange = true;
        return [x1, x2, interChange, latestKorki[x1], latestKorki[x2]] as const;
      } else {
        return [x1, x2, false, null, null] as const;
      }
    },
    [latestKorki, korkiState]
  );
  const eftaMoveFunc = (
    eatKorkId: number,
    x1: number,
    x2: number,
    interChange: boolean,
    x1Korki: Korki | null,
    x2Korki: Korki | null
  ) => {
    dispatch(
      eatEftaById({
        index: eatKorkId,
        x1,
        x2,
        interChange,
        x1Korki,
        x2Korki,
      })
    );
    dispatch(setFirstSelected(null));
    dispatch(setHasTaken(true));
    dispatch(setCheckEfta(false));
  };

  const checkEftaFun = (korki: Korki) => {
    //check current player order
    if (korki.type === currentPlayer) {
      return;
    }
    //select the first korki to move
    if (firstSelected === null) {
      dispatch(setTypeAndSelected({ selectID: korki.id, setSelected: 1 }));
      dispatch(setFirstSelected(korki));
    } else if (firstSelected.id === korki.id) {
      //deselect the selected or unselect
      dispatch(
        setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
      );
      dispatch(setFirstSelected(null));
    } else {
      //main logic
      const { eat } = checkEatable(firstSelected, korki, korkiState);
      if (eat !== -1) {
        const [x1, x2, interChange, x1Korki, x2Korki] = eftaMovedKorki(
          firstSelected.id
        );
        console.log(firstSelected.id, x1, x2, x1Korki, x2Korki);

        if (online) {
          socket.emit("eatEfta", {
            eatKorkId: firstSelected.id,
            x1,
            x2,
            interChange,
            x1Korki,
            x2Korki,
            takenBy: playerId,
          });
        } else {
          eftaMoveFunc(firstSelected.id, x1, x2, interChange, x1Korki, x2Korki);
        }
      }
    }
  };

  const makeMoveFunc = useCallback(
    (korki: Korki, firstSelected: Korki, varEat: number, varNigus: boolean) => {
      const prevStateSnapshot = JSON.parse(JSON.stringify(korkiState));
      dispatch(
        updateKorkiState({
          korki: korki,
          first: firstSelected,
          varEat: varEat,
          varNigus: varNigus,
        })
      );
      dispatch(setCurrentPlayer(firstSelected.type === 1 ? 2 : 1));
      dispatch(
        setFirstSelected(
          varEat === -1
            ? null
            : {
                ...korkiState[korki.id],
                type: firstSelected.type,
                nigus: varNigus,
                selected: 2,
              }
        )
      );
      //update previous estate for efta
      dispatch(
        setEftaLatest({
          newEfta: {
            doesEat: varEat !== -1,
            prevKorkiState: prevStateSnapshot,
            hasTaken: false,
          },
          firstId: firstSelected.id,
        })
      );
    },
    [korkiState, dispatch]
  );
  useEffect(() => {
    socket.on("takenEfta", (data: any) => {
      const { eatKorkId, x1, x2, interChange, x1Korki, x2Korki, takenBy } =
        data;
      console.log("taken", takenBy, eatKorkId);
      eftaMoveFunc(eatKorkId, x1, x2, interChange, x1Korki, x2Korki);
    });
    return () => {
      socket.off("takenEfta");
    };
  }, [eftaMoveFunc]);
  useEffect(() => {
    socket.on("moveMade", (data: any) => {
      const { korki, firstSelected, varEat, varNigus } = data;
      makeMoveFunc(korki, firstSelected, varEat, varNigus);
      dispatch(setIsMyTurn(!isMyTurn));
    });
    return () => {
      socket.off("moveMade");
    };
  }, [makeMoveFunc]);
  const updateSquare = (korki: Korki) => {
    //empty square
    if (firstSelected === null && korki.type === 3) {
      return;
    }
    if (checkEfta) {
      checkEftaFun(korki);
      return;
    }
    if (!isMyTurn && online) {
      return;
    }
    //select the first korki to move
    if (firstSelected === null) {
      //check current player order
      if (korki.type !== currentPlayer) {
        return;
      }

      dispatch(setTypeAndSelected({ selectID: korki.id, setSelected: 1 }));
      dispatch(setFirstSelected(korki));
    } else if (firstSelected.id === korki.id) {
      //deselect the selected or unselect
      dispatch(
        setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
      );
      dispatch(setFirstSelected(null));
    } else {
      //main logic
      let varMovable = false;
      let varEat = -1;
      let varNigus = false;
      let secondMove = false;

      //check ongoing movement / second move after eating
      if (firstSelected.selected === 2) {
        console.log("second");

        const { movable, eat, nigus } = checkEatable(
          firstSelected,
          korki,
          korkiState
        );
        console.log("eat", eat);

        if (eat !== -1) {
          varMovable = movable;
          varEat = eat;
          varNigus = nigus;
        } else {
          dispatch(
            setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
          );
          dispatch(setFirstSelected(null));
        }
        secondMove = true;
      }

      if (!secondMove) {
        //normal move checkpoint
        const { movable, eat, nigus } = checkEatable(
          firstSelected,
          korki,
          korkiState
        );
        varMovable = movable;
        varEat = eat;
        varNigus = nigus;
      }

      if (varMovable) {
        if (online) {
          socket.emit("makeMove", { korki, firstSelected, varEat, varNigus });
        } else {
          makeMoveFunc(korki, firstSelected, varEat, varNigus);
        }
      } else {
        //off the selected
        dispatch(
          setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
        );
        dispatch(setFirstSelected(null));
      }
    }
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
      {online && (
        <Center mt={3}>
          <div className="text-sm text-gray-600">
            {isMyTurn ? "Your turn" : "Opponent's turn"}
          </div>
        </Center>
      )}
    </Box>
  );
};

export default Board;
