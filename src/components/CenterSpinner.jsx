import { Spinner } from "react-bootstrap";

export const CenterSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner />
    </div>
  );
};
export default CenterSpinner;
