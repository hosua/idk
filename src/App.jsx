import "./App.css";

// import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/yeti/bootstrap.min.css";
// import "bootswatch/dist/darkly/bootstrap.min.css";
import RandomFactPage from "@pages/RandomFactPage";
import CheapSharkPage from "@pages/CheapSharkPage";
import RandomDogPage from "@pages/RandomDogPage";
import RandomDuckPage from "@pages/RandomDuckPage";
import ChessPage from "@pages/ChessPage";

function App() {
  return (
    <>
      <RandomFactPage />
      <CheapSharkPage />
      <RandomDogPage />
      <RandomDuckPage />
      {/*
      <ChessPage />
      */}
    </>
  );
}

export default App;
