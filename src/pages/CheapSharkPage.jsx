import React, { useState, useEffect, useMemo } from "react";
import { Button, Container, Table, Form, InputGroup } from "react-bootstrap";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const CheapSharkPage = () => {
  const [stores, setStores] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [games, setGames] = useState([]);
  const [dlc, setDlc] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchForGame = async () => {
    const res = await fetch(
      `https://www.cheapshark.com/api/1.0/games?title=${searchQuery}&limit=1000`,
    );
    const json = await res.json();
    const games = json.filter((item) => item.steamAppID);
    const dlc = json.filter((item) => !item.steamAppID);
    setGames(games);
    setDlc(dlc);
  };

  // const fetchStores = async () => {
  //   const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
  //   const json = await res.json();
  //   setStores(json);
  // };

  // useEffect(() => {
  //   fetchStores();
  // }, []);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("thumb", {
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
      columnHelper.accessor("external", {
        header: "Title",
        enableSorting: true,
      }),
      columnHelper.accessor("cheapest", {
        header: "Cheapest Price",
        enableSorting: true,
        cell: ({ getValue }) => `$${getValue()}`,
      }),
      // columnHelper.accessor("gameID", {
      //   header: "Game ID",
      //   enableSorting: true,
      // }),
      columnHelper.accessor("steamAppID", {
        header: "Steam App ID",
        enableSorting: true,
      }),
    ],
    [],
  );

  useEffect(() => console.log(games), [games]);

  const table = useReactTable({
    data: games,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const { getRowModel, getHeaderGroups } = table;

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
      <Table striped bordered>
        <thead>
          {getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : null,
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={async () => {
                // const { cheapestDealID: id } = row.original;
                // const res = await fetch(
                //   `https://www.cheapshark.com/api/1.0/deals?id=${id}`,
                // );
                // const data = await res.json();
                // console.log(data);
                // // Go to steam store page */
                if (row.original.steamAppID) {
                  window.open(
                    `https://store.steampowered.com/app/${row.original.steamAppID}/`,
                    "_blank",
                  );
                }
              }}
              style={{
                cursor: row.original.steamAppID ? "pointer" : null,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CheapSharkPage;
