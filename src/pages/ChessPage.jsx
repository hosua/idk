import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Chess } from "chess.js";

const FEN_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const pgnToFenList = (pgn) => {
  const fenList = [];
  let chess = new Chess();
  pgn = pgn.replace(/\{.*?\}/g, "");
  chess.loadPgn(pgn);
  const moveList = chess.history();
  chess = new Chess();
  moveList.forEach((move) => {
    chess.move(move);
    fenList.push(chess.fen());
  });
  return fenList;
};
// some rendering magic
const renderChessBoard = (fen) => {};
// return 8x8 matrix of the board
const fenToBoard = (fen) => {
  if (!fen) return;
  const board = Array(8)
    .fill()
    .map(() => Array(8).fill("-"));

  const rows = fen.split(" ")[0].split("/");
  for (let i = 0; i < 8; ++i) {
    let j = 0;
    for (let ch of rows[i]) !isNaN(ch) ? (j += +ch) : (board[i][j++] = ch);
  }
  console.log(board);
};

export const ChessPage = () => {
  const [games, setGames] = useState([]);
  const [fenList, setFenList] = useState([]);
  const fetchGames = async ({ username, mm, yyyy }) => {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${yyyy}/${mm}`,
    );
    const { games } = await res.json();
    setFenList(pgnToFenList(games[0].pgn));
    for (const fen of fenList) {
      fenToBoard(fen);
    }
    return games;
  };

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
            const res = pgnToFenList(games[0].pgn);
          }}
        >
          Fetch
        </Button>
        <br />
        {fenList.length > 0 && <>chess component goes here</>}
      </Container>
    </>
  );
};

export default ChessPage;
