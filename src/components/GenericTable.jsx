import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Container,
  Table,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import Select from "@components/Select";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const GenericTable = ({
  data,
  columns,
  handleRowClick,
  rowStyle,
  paginated = true,
  pageSize = 10,

  initialState,
  bordered,
  hover,
  striped,
}) => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const pageOptions = [10, 20, 30, 40, 50].map((num) => ({
    label: num,
    value: num,
  }));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      pageSize: { label: pageSize, value: pageSize },
    },
  });

  const renderPaginateButtons = () => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <label className="mx-2">{`${pagination.pageIndex + 1} / ${Math.ceil(data.length / table.getState().pagination.pageSize)}`}</label>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        <Select
          value={pageOptions.find(
            (option) => option.value === table.getState().pagination.pageSize,
          )}
          onChange={(selectedOption) => {
            table.setPageSize(selectedOption.value);
          }}
          options={pageOptions}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>
      </div>
    );
  };

  const { getRowModel, getHeaderGroups } = table;

  return (
    <>
      <Table
        striped={striped}
        bordered={bordered}
        hover={hover}
        initialState={initialState}
      >
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
              onClick={() => handleRowClick(row)}
              style={rowStyle}
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
      {paginated && renderPaginateButtons()}
    </>
  );
};

export default GenericTable;
