import React from "react";
import { Spinner } from "react-bootstrap";

export const CenterSpinner = () => {
  return (
    <div className="d-flex align-items-center justify-content-center mb-2">
      <Spinner />
    </div>
  );
};
export default CenterSpinner;
