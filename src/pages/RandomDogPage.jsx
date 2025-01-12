import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table } from "react-bootstrap";

export const RandomDogPage = () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [dogList, setDogList] = useState([]);

  const fetchDog = async () => {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const { message } = await res.json();
    setDogList([{ url: message }, ...dogList]);
    return message;
  };

  return (
    <>
      <Container className="my-3">
        <h3> Dogs </h3>
        <div className="mb-3">
          <Button className="me-2" onClick={fetchDog}>
            Get Dog
          </Button>
          <Button onClick={() => setDogList([])}>Clear Dogs</Button>
        </div>
        {dogList.map(({ url }, index) => (
          <img
            className="me-2 mb-2"
            key={index}
            src={url}
            style={{
              maxWidth: "500px",
              maxHeight: "500px",
              objectFit: "contain",
            }}
            alt="dog"
          />
        ))}
      </Container>
    </>
  );
};

export default RandomDogPage;
