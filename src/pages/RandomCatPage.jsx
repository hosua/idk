import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table, Spinner } from "react-bootstrap";

export const RandomCatPage = () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [catList, setCatList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCat = async ({ gif }) => {
    if (!loading) {
      setLoading(true);
      try {
        const res = await fetch(`https://cataas.com/cat${gif ? "/gif" : ""}`);
        const blob = await res.blob();
        const imgURL = URL.createObjectURL(blob);
        setCatList([{ url: imgURL }, ...catList]);
      } catch (err) {
        console.error("Failed to fetch cat", error);
      } finally {
        setLoading(false);
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
        {loading && <Spinner />}
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
