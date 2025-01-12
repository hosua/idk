import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table } from "react-bootstrap";

export const RandomDuckPage = () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [duckList, setDuckList] = useState([]);

  const fetchDuck = async () => {
    const res = await fetch("/duck/api/v2/random");
    const { url } = await res.json();
    console.log(url);
    setDuckList([{ url }, ...duckList]);
    return message;
  };

  return (
    <>
      <Container className="my-3">
        <h3> Ducks </h3>
        <div className="mb-3">
          <Button className="me-2" onClick={fetchDuck}>
            Get Duck
          </Button>
          <Button onClick={() => setDuckList([])}>Clear Ducks</Button>
        </div>
        {duckList.map(({ url }, index) => (
          <img
            className="me-2 mb-2"
            key={index}
            src={url}
            style={{
              maxWidth: "500px",
              maxHeight: "500",
              objectFit: "contain",
            }}
            alt="dog"
          />
        ))}
      </Container>
    </>
  );
};

export default RandomDuckPage;
