import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table } from "react-bootstrap";

export const RandomFactPage = () => {
  const [factList, setFactList] = useState([]);
  const fetchFact = async () => {
    const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
    const { text, source } = await res.json();
    setFactList([{ text, source }, ...factList]);
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <>
      <Container className="my-3">
        <Button className="me-2" onClick={fetchFact}>
          Generate New Fact
        </Button>
        <Button onClick={() => setFactList([])}>Clear Facts</Button>
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
    </>
  );
};

export default RandomFactPage;
