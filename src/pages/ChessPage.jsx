import React, { useEffect, useState, useMemo } from "react";
import { Button, Container } from "react-bootstrap";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GenericTable from "@components/GenericTable";
import { createColumnHelper } from "@tanstack/react-table";

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
  const x = 4;
  return [FEN_START, ...fenList];
};

export const ChessPage = () => {
  const [games, setGames] = useState([]);
  const [gamesIdx, setGamesIdx] = useState(0);

  const [fenList, setFenList] = useState([]);
  const [fenIdx, setFenIdx] = useState(0);
  const [fen, setFen] = useState(FEN_START);

  const [selectedUser, setSelectedUser] = useState("MagnusCarlsen");

  const fetchGames = async ({ username, mm, yyyy }) => {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${yyyy}/${mm}`,
    );
    const { games } = await res.json();
    return games;
  };

  const renderChessBoard = () => (
    <>
      <Button
        className="me-2 mb-2"
        onClick={() => fenIdx > 0 && setFenIdx(fenIdx - 1)}
      >
        Prev Move
      </Button>
      <Button
        className="me-2 mb-2"
        onClick={() => fenIdx < fenList.length - 1 && setFenIdx(fenIdx + 1)}
      >
        Next Move
      </Button>
      <span>{`${fenIdx + 1} / ${fenList.length}`}</span>
      <Chessboard position={fen} arePiecesDraggable={false} boardWidth={500} />
    </>
  );

  const getRowPlayerColor = ({ white }) =>
    white.username.toLocaleLowerCase() === selectedUser.toLocaleLowerCase()
      ? "white"
      : "black";

  const getRowOpponent = ({ black, white }) =>
    black.username.toLocaleLowerCase() === selectedUser.toLocaleLowerCase()
      ? { ...white, color: "white" }
      : { ...black, color: "black" };

  const helper = createColumnHelper();
  const columns = useMemo(
    () => [
      helper.accessor((row) => getRowPlayerColor(row), {
        header: "Played as",
      }),
      helper.accessor(
        (row) =>
          `${getRowOpponent(row).username} (${getRowOpponent(row).color})`,
        {
          header: "Opponent",
        },
      ),
      helper.accessor((row) => getRowOpponent(row).rating, {
        header: "Rating",
      }),
      helper.accessor(
        ({ accuracies }) => `W: ${accuracies.white} | B: ${accuracies.black}`,
        {
          header: "Accuracies",
        },
      ),
      helper.accessor("rules", {
        header: "Rules",
      }),
      helper.accessor("time_class", {
        header: "Time Class",
      }),
    ],
    [],
  );

  useEffect(() => {
    if (fenIdx < fenList.length) setFen(fenList[fenIdx]);
  }, [fenIdx]);

  useEffect(() => {
    console.log(`games = ${JSON.stringify(games, null, 2)}`);
  }, [games]);

  return (
    <>
      <Container>
        <h3> Chess </h3>
        <Button
          className="mb-2 me-2"
          onClick={async () => {
            const games = await fetchGames({
              username: "magnuscarlsen",
              yyyy: "2025",
              mm: "01",
            });
            setGames([...games]);
            setFenList(pgnToFenList(games[0].pgn));
          }}
        >
          Fetch
        </Button>
        <Button
          className="mb-2"
          onClick={() => {
            setFenList([]);
            setGames([]);
          }}
        >
          Clear
        </Button>
        <br />
        {games.length > 0 && (
          <GenericTable
            data={games}
            columns={columns}
            handleRowClick={(row) => {
              setFenList(pgnToFenList(row.original.pgn));
              setFenIdx(0);
            }}
          />
        )}
        <br />
        {fenList.length > 0 && renderChessBoard()}
      </Container>
    </>
  );
};

export default ChessPage;
