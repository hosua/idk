import React from "react";
import { default as ReactSelect } from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    color: "white",
    backgroundColor: "#212121",
    border: "1px solid #495056",
    borderRadius: "none",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#212121",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#212121" : "#2D2D2D",
    color: "white",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  backgroundColor: "#212121",
};

export const Select = (props) => {
  return <ReactSelect {...props} styles={customStyles} />;
};
export default Select;
