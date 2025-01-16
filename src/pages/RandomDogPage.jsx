import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CenterSpinner from "@components/CenterSpinner";

export const RandomDogPage = () => {
  const [dogList, setDogList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDog = async () => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const { message } = await res.json();
        setDogList([{ url: message }, ...dogList]);
      } catch (err) {
        console.error("Error fetching dog", err);
      } finally {
        setIsLoading(false);
      }
    }
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
        {isLoading && (
          <>
            <CenterSpinner />
            <br />
          </>
        )}
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
