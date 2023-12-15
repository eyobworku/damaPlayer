import { Grid, GridItem } from "@chakra-ui/react";
import Board from "./components/Board";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react";

function App() {
  const [eftaState, setEftaState] = useState(false);
  return (
    <>
      <Grid
        templateAreas={`'nav'
                        'main side'`}
        gridTemplateRows={"50px auth"}
        gridTemplateColumns={"auth 60px"}
      >
        <GridItem area={"nav"} gridRow="1" gridColumn="1 / span 2">
          <NavBar />
        </GridItem>
        <GridItem area={"main"} gridColumn="1">
          <Board
            checkEftaVar={eftaState}
            offSelectEfta={() => setEftaState(false)}
          />
        </GridItem>
        <GridItem marginY={3} bg="gray" area={"side"} gridColumn="2">
          <SideBar
            eftaState={eftaState}
            onSelectEfta={() => setEftaState(!eftaState)}
          />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
