import { Grid, GridItem } from "@chakra-ui/react";
import Board from "./Board";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { useState } from "react";
import useGameState from "../hooks/useGameState";

function BoardGamePage() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [eftaStateBool, setEftaState1] = useState(false);
  const gameId = queryParameters.get("gameId");
  const gameIdNum = parseInt(gameId !== null ? gameId : "-1");
  // console.log("gameId " + gameId);

  const {
    korkiState,
    firstSelected,
    setFirstSelected,
    eftaState,
    currentPlayer,
    setCurrentPlayer,
  } = useGameState(gameIdNum);
  return (
    <>
      <Grid
        templateAreas={`'nav'
                        'main side'`}
        gridTemplateRows={"60px 1fr"}
        gridTemplateColumns={"1fr 300px"}
      >
        <GridItem area={"nav"} gridRow="1" gridColumn="1 / span 2">
          <NavBar />
        </GridItem>
        <GridItem area={"main"} gridColumn="1" gridRow="2">
          <Board
            checkEftaVar={eftaStateBool}
            offSelectEfta={() => {
              setEftaState1(false);
            }}
            updateCurentPlaying={(curPl) => {
              setCurrentPlayer(curPl);
            }}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            korkiState={korkiState}
            firstSelected={firstSelected}
            setFirstSelected={setFirstSelected}
            eftaState={eftaState}
          />
        </GridItem>
        <GridItem
          marginY={3}
          bg="gray"
          area={"side"}
          gridColumn="2"
          gridRow="2"
        >
          <SideBar
            eftaState={eftaStateBool}
            currentPlayer={currentPlayer}
            onSelectEfta={() => setEftaState1(!eftaStateBool)}
          />
        </GridItem>
      </Grid>
    </>
  );
}

export default BoardGamePage;
