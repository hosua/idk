import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

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
  return [FEN_START, ...fenList];
};
const renderChessBoard = (fen) => (
  <Chessboard position={fen} arePiecesDraggable={false} />
);

export const ChessPage = () => {
  const [games, setGames] = useState([]);
  const [fenList, setFenList] = useState([]);
  const [fen, setFen] = useState(FEN_START);
  const [fenIdx, setFenIdx] = useState(0);
  const fetchGames = async ({ username, mm, yyyy }) => {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${yyyy}/${mm}`,
    );
    const { games } = await res.json();
    setFenList(pgnToFenList(games[0].pgn));
    for (const fen of fenList) {
      fenToBoard(fen);
    }
    renderChessBoard(fenList[0]);
    return games;
  };

  useEffect(() => {
    if (fenIdx < fenList.length) setFen(fenList[fenIdx]);
  }, [fenIdx]);

  return (
    <>
      <Container>
        <h3> Chess </h3>
        <Button
          className="mb-2"
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
        <Button
          className="me-2 mb-2"
          onClick={() => fenIdx >= 0 && setFenIdx(fenIdx - 1)}
        >
          Prev Move
        </Button>
        <Button
          className="me-2 mb-2"
          onClick={() => fenIdx < fenList.length - 1 && setFenIdx(fenIdx + 1)}
        >
          Next Move
        </Button>
        {fenList.length > 0 && (
          <Chessboard
            position={fen}
            arePiecesDraggable={false}
            boardWidth={400}
          />
        )}
      </Container>
    </>
  );
};

export default ChessPage;
