import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

// const theme = extendTheme({
//   colors: {
//     primary: {
//       50: "#000000",
//     },
//   },
// });
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ChakraProvider theme={theme}> */}
    <ChakraProvider>
      <ColorModeScript initialColorMode={"dark"} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
