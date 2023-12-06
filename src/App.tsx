import { Grid, GridItem } from "@chakra-ui/react";
import Board from "./components/Board";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Grid
        templateAreas={`'nav'
                      'main'`}
        gridTemplateRows={"50px 1fr"}
      >
        <GridItem area={"nav"}>
          <NavBar />
        </GridItem>
        <GridItem area={"main"}>
          {/* <Board /> */}
          <Board />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
