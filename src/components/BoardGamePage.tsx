import { Grid, GridItem } from "@chakra-ui/react";
import Board from "./Board";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

function BoardGamePage() {
  // const queryParameters = new URLSearchParams(window.location.search);
  // const gameId = queryParameters.get("gameId");
  // const gameIdNum = parseInt(gameId !== null ? gameId : "-1");
  // console.log("gameId " + gameId);

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
          <Board />
        </GridItem>
        <GridItem
          marginY={3}
          bg="gray"
          area={"side"}
          gridColumn="2"
          gridRow="2"
        >
          <SideBar />
        </GridItem>
      </Grid>
    </>
  );
}

export default BoardGamePage;
