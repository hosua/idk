import React, { useState, useEffect, useMemo } from "react";
import { Button, Container, Table, Form, InputGroup } from "react-bootstrap";
import { createColumnHelper } from "@tanstack/react-table";
import GenericTable from "@components/GenericTable";
import CenterSpinner from "@components/CenterSpinner";

export const CheapSharkPage = () => {
  const [sorting, setSorting] = useState([]);
  const [games, setGames] = useState([]);
  const [dlc, setDlc] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchForGame = async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://www.cheapshark.com/api/1.0/games?title=${searchQuery}&limit=1000`,
    );
    const json = await res.json();
    setIsLoading(false);
    const games = json.filter((item) => item.steamAppID);
    const dlc = json.filter((item) => !item.steamAppID);
    setGames(games);
    setDlc(dlc);
  };

  const helper = createColumnHelper();

  const columns = useMemo(
    () => [
      helper.accessor("thumb", {
        header: "Thumbnail",
        cell: ({ getValue }) => (
          <div className="text-center">
            <img
              src={getValue()}
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                objectFit: "contain",
              }}
              alt="thumbnail"
            />
          </div>
        ),
        enableSorting: false,
      }),
      helper.accessor("external", {
        header: "Title",
      }),
      helper.accessor("cheapest", {
        header: "Cheapest Price",
        cell: ({ getValue }) => `$${getValue()}`,
      }),
      helper.accessor("steamAppID", {
        header: "Steam App ID",
      }),
    ],
    [],
  );

  // useEffect(() => console.log(games), [games]);

  return (
    <Container>
      <h2>Steam Games</h2>
      <InputGroup className="mb-3">
        <Button variant="secondary" onClick={searchForGame}>
          Search
        </Button>
        <Form.Control
          placeholder="Search games..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchForGame();
          }}
        />
      </InputGroup>
      {isLoading && <CenterSpinner />}
      {games.length > 0 && !isLoading && (
        <GenericTable
          data={games}
          columns={columns}
          handleRowClick={(row) => {
            if (row.original.steamAppID) {
              window.open(
                `https://store.steampowered.com/app/${row.original.steamAppID}/`,
                "_blank",
              );
            }
          }}
          striped
          bordered
          hover
        />
      )}
    </Container>
  );
};

export default CheapSharkPage;
