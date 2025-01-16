import React, { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import CenterSpinner from "@components/CenterSpinner";

export const RandomFactPage = () => {
  const [factList, setFactList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchFact = async () => {
    if (!isLoading) {
      setIsLoading(true);
      const res = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random",
      );
      setIsLoading(false);
      const { text, source } = await res.json();
      setFactList([{ text, source }, ...factList]);
    }
  };

  return (
    <Container className="mt-3">
      <h3>Facts</h3>
      <Button className="me-2" onClick={fetchFact}>
        Generate New Fact
      </Button>
      <Button onClick={() => setFactList([])}>Clear Facts</Button>
      {isLoading && <CenterSpinner />}
      <Table striped bordered className="my-3">
        <tbody>
          {factList.map(({ text }, index) => (
            <tr key={index}>
              <td key={index}>{text}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default RandomFactPage;
