import React from "react";
import "./App.css";

// import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/yeti/bootstrap.min.css";
// import "bootswatch/dist/darkly/bootstrap.min.css";
import RandomFactPage from "@pages/RandomFactPage";
import CheapSharkPage from "@pages/CheapSharkPage";
import RandomDogPage from "@pages/RandomDogPage";
import RandomCatPage from "@pages/RandomCatPage";
import ChessPage from "@pages/ChessPage";

function App() {
  return (
    <>
      <RandomFactPage />
      <RandomDogPage />
      <RandomCatPage />
      <CheapSharkPage />
      <ChessPage />
      <br />
    </>
  );
}

export default App;
