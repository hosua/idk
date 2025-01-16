import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CenterSpinner from "@components/CenterSpinner";

export const RandomCatPage = () => {
  const [catList, setCatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCat = async ({ gif }) => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const res = await fetch(`https://cataas.com/cat${gif ? "/gif" : ""}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setCatList([{ url }, ...catList]);
      } catch (err) {
        console.error("Failed to fetch cat", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Container className="my-3">
        <h3> Cats </h3>
        <div className="mb-3">
          <Button className="me-2" onClick={fetchCat}>
            Get Cat Image
          </Button>
          <Button className="me-2" onClick={() => fetchCat({ gif: true })}>
            Get Cat Gif
          </Button>
          <Button onClick={() => setCatList([])}>Clear Cats</Button>
        </div>
        {isLoading && (
          <>
            <CenterSpinner />
            <br />
          </>
        )}
        {catList.map(({ url }, index) => (
          <>
            <img
              className="me-2 mb-2"
              key={index}
              src={url}
              style={{
                maxWidth: "75vw",
                maxHeight: "50vh",
                objectFit: "contain",
              }}
              alt="cat"
            />
            <br />
          </>
        ))}
      </Container>
    </>
  );
};

export default RandomCatPage;
