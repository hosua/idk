import GenericTable from "@components/GenericTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

const DATA = [
  {
    id: 0,
    name: "bob",
  },
  {
    id: 1,
    name: "bill",
  },
  {
    id: 2,
    name: "joe",
  },
  {
    id: 2,
    name: "shakira",
  },
];

export const TableTest = () => {
  const helper = createColumnHelper();
  const columns = useMemo(
    () => [
      helper.accessor("id", {
        header: "ID",
      }),
      helper.accessor("name", {
        header: "Name",
      }),
    ],
    [],
  );
  return (
    <>
      <GenericTable data={DATA} columns={columns} />
    </>
  );
};
export default TableTest;
