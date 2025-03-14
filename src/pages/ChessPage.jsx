import React, { useEffect, useState, useMemo } from "react";
import { Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import CenterSpinner from "@components/CenterSpinner";
import GenericTable from "@components/GenericTable";
import { createColumnHelper } from "@tanstack/react-table";
import Select from "@components/Select";
import moment from "moment";

const monthOptions = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month, idx) => ({ label: month, value: idx + 1 }));

const CURRENT_MONTH = monthOptions.find(
  (option) => option.value === new Date().getMonth() + 1,
);
const CURRENT_YEAR = new Date().getFullYear();

const YEAR_START = 2007;

const yearOptions = Array.from(
  { length: CURRENT_YEAR - YEAR_START + 1 },
  (_, idx) => {
    const year = YEAR_START + idx;
    return { label: year, value: year };
  },
).reverse();

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
    month: CURRENT_MONTH,
  });
  const [games, setGames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [playerInfo, setPlayerInfo] = useState({ black: "", white: "" });

  const [fenList, setFenList] = useState([]);
  const [fenIdx, setFenIdx] = useState(0);
  const [fen, setFen] = useState(FEN_START);

  const [isLoading, setIsLoading] = useState(false);

  const fetchGames = async () => {
    const url = `https://api.chess.com/pub/player/${selectedUser}/games/${date.year.value}/${date.month.value.toString().padStart(2, 0)}`;
    const res = await fetch(url);
    const { games } = await res.json();
    return games;
  };

  const renderChessBoard = () => (
    <>
      {fenList.length > 0 && (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h4>{playerInfo.black}</h4>
          <span>
            <Chessboard
              position={fen}
              arePiecesDraggable={false}
              boardWidth={500}
            />
          </span>
          <h4 className="my-2">{playerInfo.white}</h4>
          <div className="d-flex flex-row align-items-center">
            <Button onClick={() => setFenIdx(0)} disabled={fenIdx <= 0}>
              {"<<"}
            </Button>
            <Button
              onClick={() => fenIdx > 0 && setFenIdx(fenIdx - 1)}
              disabled={fenIdx <= 0}
            >
              {"<"}
            </Button>
            <label className="mx-2">{`${fenIdx + 1} / ${fenList.length}`}</label>
            <Button
              onClick={() =>
                fenIdx < fenList.length - 1 && setFenIdx(fenIdx + 1)
              }
              disabled={fenIdx >= fenList.length - 1}
            >
              {">"}
            </Button>
            <Button
              onClick={() => setFenIdx(fenList.length - 1)}
              disabled={fenIdx >= fenList.length - 1}
            >
              {">>"}
            </Button>
            <Button
              className="px-3"
              variant="outline-danger"
              onClick={() => setFenList([])}
            >
              X
            </Button>
          </div>
        </div>
      )}
    </>
  );

  const getRowPlayer = ({ black, white }) =>
    white.username.toLocaleLowerCase() === selectedUser.toLocaleLowerCase()
      ? { ...white, color: "white" }
      : { ...black, color: "black" };

  const getRowOpponent = ({ black, white }) =>
    black.username.toLocaleLowerCase() === selectedUser.toLocaleLowerCase()
      ? { ...white, color: "white" }
      : { ...black, color: "black" };

  const helper = createColumnHelper();
  const columns = [
    helper.accessor((row) => getRowPlayer(row).rating, {
      header: "Player ELO",
    }),
    helper.accessor((row) => getRowOpponent(row).rating, {
      header: "Opponent ELO",
    }),
    helper.accessor((row) => getRowPlayer(row).result, {
      header: "Result",
    }),
    helper.accessor((row) => getRowPlayer(row).color, {
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
              {getRowPlayer(row.original).color === "white"
                ? `W: ${accuracies?.white.toFixed(2) ?? "---"} | B: ${accuracies?.black.toFixed(2) ?? "---"}`
                : `B: ${accuracies?.black.toFixed(2) ?? "---"} | W: ${accuracies?.white.toFixed(2) ?? "---"}`}
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
    if (!isLoading) {
      if (selectedUser === "") {
        setFenList([]);
        setGames([]);
      } else {
        setIsLoading(true);
        const res = await fetchGames({
          username: selectedUser.toLowerCase(),
          yyyy: date.year.value,
          mm: date.month.value.toString().padStart(2, "0"),
        });
        setIsLoading(false);
        console.log(res);
        if (res) setGames([...res]);
      }
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
          <InputGroup className="mb-3">
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
            <Col className="d-flex align-items-end">
              <Button onClick={handleFetchGames}>Search</Button>
              <Button
                variant="outline-danger"
                className="px-3 mr-auto"
                onClick={() => {
                  setFenList([]);
                  setGames([]);
                }}
              >
                <strong>X</strong>
              </Button>
            </Col>
            <Col sm={2} />
          </InputGroup>
        </Row>
        {isLoading && <CenterSpinner />}
        {games.length > 0 && (
          <GenericTable
            data={games}
            columns={columns}
            handleRowClick={(row) => {
              setFenIdx(0);
              setFenList(pgnToFenList(row.original.pgn));
              setPlayerInfo({
                black: row.original.black.username,
                white: row.original.white.username,
              });
              // window.scrollTo(0, document.body.scrollHeight);
            }}
            striped
            bordered
            hover
          />
        )}
        <br />
        <div className="align-items-center text-center">
          {fenList.length > 0 && renderChessBoard()}
        </div>
      </Container>
    </>
  );
};

export default ChessPage;
