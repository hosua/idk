import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Chess } from "chess.js";

const FEN_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const ChessPage = () => {
  const [games, setGames] = useState([]);
  const [fenList, setFenList] = useState([]);
  const [chess, setChess] = useState(new Chess());
  const fetchGames = async ({ username, mm, yyyy }) => {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${yyyy}/${mm}`,
    );
    const { games } = await res.json();
    setChess(new Chess());
    console.log(chess);
    chess.load_pgn(games[0].pgn);
    return games;
  };

  const getPgnList = () => {};

  return (
    <>
      <Container>
        <h3> Chess </h3>
        <Button
          onClick={async () => {
            const games = await fetchGames({
              username: "magnuscarlsen",
              yyyy: "2025",
              mm: "01",
            });
            setGames(games);
            console.log(games[0].pgn);
          }}
        >
          Fetch
        </Button>
      </Container>
    </>
  );
};

export default ChessPage;
