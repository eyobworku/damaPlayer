import { Grid, GridItem } from "@chakra-ui/react";
import Board from "./components/Board";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react";

function App() {
	const [eftaState, setEftaState] = useState(false);
	const [currentPlayer, setCurrentPlayer] = useState(0);
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
						checkEftaVar={eftaState}
						offSelectEfta={() => {
							setEftaState(false);
						}}
						updateCurentPlaying={(curPl) => {
							setCurrentPlayer(curPl);
						}}
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
						eftaState={eftaState}
						currentPlayer={currentPlayer}
						onSelectEfta={() => setEftaState(!eftaState)}
					/>
				</GridItem>
			</Grid>
		</>
	);
}

export default App;
