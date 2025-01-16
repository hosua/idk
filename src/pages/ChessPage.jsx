import React, { useEffect, useState, useMemo } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GenericTable from "@components/GenericTable";
import { createColumnHelper } from "@tanstack/react-table";
import Select from "@components/Select";
import moment from "moment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_START = 2007;
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

export const ChessPage = () => {
  const [date, setDate] = useState({
    year: { label: CURRENT_YEAR, value: CURRENT_YEAR },
    month: { label: "January", value: 1 },
  });
  const [games, setGames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [fenList, setFenList] = useState([]);
  const [fenIdx, setFenIdx] = useState(0);
  const [fen, setFen] = useState(FEN_START);

  const fetchGames = async () => {
    const url = `https://api.chess.com/pub/player/${selectedUser}/games/${date.year.value}/${date.month.value.toString().padStart(2, 0)}`;
    const res = await fetch(url);
    const { games } = await res.json();
    return games;
  };

  const monthOptions = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const yearOptions = Array.from(
    { length: CURRENT_YEAR - YEAR_START + 1 },
    (_, idx) => {
      const year = YEAR_START + idx;
      return { label: year, value: year };
    },
  ).reverse();

  const renderChessBoard = () => (
    <>
      <div className="d-flex align-items-center justify-content-center">
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
        <div
          className="ms-2 mb-2"
          style={{ cursor: "pointer" }}
          onClick={() => setFenIdx(0)}
        >
          <RestartAltIcon style={{ fontSize: 45, color: "grey" }} />
        </div>
        <span className="ms-5">{`${fenIdx + 1} / ${fenList.length}`}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>
          <Chessboard
            position={fen}
            arePiecesDraggable={false}
            boardWidth={500}
          />
        </span>
      </div>
    </>
  );

  const getRowPlayer = ({ black, white }, selectedUser) =>
    white.username.toLocaleLowerCase() === selectedUser.toLocaleLowerCase()
      ? { ...white, color: "white" }
      : { ...black, color: "black" };

  const getRowOpponent = ({ black, white }, selectedUser) =>
    black.username.toLocaleLowerCase() === selectedUser.toLocaleLowerCase()
      ? { ...white, color: "white" }
      : { ...black, color: "black" };

  const helper = createColumnHelper();
  const columns = [
    helper.accessor((row) => getRowPlayer(row, selectedUser).rating, {
      header: "Player Rating",
    }),
    helper.accessor((row) => getRowOpponent(row, selectedUser).rating, {
      header: "Opponent Rating",
    }),
    helper.accessor((row) => getRowPlayer(row, selectedUser).result, {
      header: "Result",
    }),
    helper.accessor((row) => getRowPlayer(row, selectedUser).color, {
      header: "Color",
    }),
    helper.accessor(
      (row) =>
        `${getRowOpponent(row, selectedUser).username} (${getRowOpponent(row, selectedUser).color})`,
      {
        header: "Opponent",
      },
    ),
    helper.accessor(
      ({ accuracies }) =>
        `W: ${accuracies?.white.toFixed(2) ?? "---"} | B: ${accuracies?.black.toFixed(2) ?? "---"}`,
      {
        header: "Accuracies",
        enableSorting: false,
        cell: ({ row }) => {
          const { accuracies } = row.original;
          return (
            <div className="text-center">
              {`W: ${accuracies?.white.toFixed(2) ?? "---"} | B: ${accuracies?.black.toFixed(2) ?? "---"}`}
            </div>
          );
        },
      },
    ),
    helper.accessor("rules", {
      header: "Rules",
    }),
    helper.accessor("time_class", {
      header: "Time Class",
    }),
    helper.accessor(
      ({ end_time }) => moment.unix(end_time).format("MM/DD/YYYY hh:mm:ss"),
      {
        header: "End Time",
      },
    ),
  ];

  const handleFetchGames = async () => {
    if (selectedUser === "") {
      setFenList([]);
      setGames([]);
    } else {
      const games = await fetchGames({
        username: selectedUser.toLowerCase(),
        yyyy: date.year.value,
        mm: date.month.value.toString().padStart(2, "0"),
      });
      setGames([...games]);
      setFenList(games.length > 0 ? pgnToFenList(games[0].pgn) : []);
    }
  };

  useEffect(() => {
    if (fenIdx < fenList.length) setFen(fenList[fenIdx]);
  }, [fenIdx]);

  useEffect(() => {
    // console.log(`games = ${JSON.stringify(games, null, 2)}`);
  }, [games]);

  return (
    <>
      <Container>
        <h3> Chess.com Lookup </h3>
        <Row>
          <Col sm={2}>
            <label>Username</label>
            <Form.Control
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFetchGames();
                }
              }}
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            />
          </Col>
          <Col sm={3}>
            <label>Month</label>
            <Select
              options={monthOptions}
              value={date.month}
              onChange={(option) => {
                setDate({
                  ...date,
                  month: option,
                });
              }}
            />
          </Col>
          <Col sm={2}>
            <label>Year</label>
            <Select
              options={yearOptions}
              value={date.year}
              onChange={(option) => {
                setDate({
                  ...date,
                  year: option,
                });
              }}
            />
          </Col>
          <Col sm={6} />
        </Row>
        <br />
        <Button className="mb-2 me-2" onClick={handleFetchGames}>
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
              setFenIdx(0);
              setFenList(pgnToFenList(row.original.pgn));
              window.scrollTo(0, document.body.scrollHeight);
            }}
            striped
            bordered
            hover
          />
        )}
        <br />
        <div style={{ alignItems: "center" }} className="text-center">
          {fenList.length > 0 && renderChessBoard()}
        </div>
      </Container>
    </>
  );
};

export default ChessPage;
