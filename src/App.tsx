import { Grid, GridItem } from "@chakra-ui/react";
import Board from "./components/Board";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Grid
        templateAreas={`'nav'
                        'main side'`}
        gridTemplateRows={"50px 1fr"}
        gridTemplateColumns={"auth 80px"}
      >
        <GridItem area={"nav"} gridRow="1" gridColumn="1 / span 2">
          <NavBar />
        </GridItem>
        <GridItem area={"main"} gridColumn="1">
          <Board />
        </GridItem>
        <GridItem bg="gray" area={"side"} gridColumn="2">
          side
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
