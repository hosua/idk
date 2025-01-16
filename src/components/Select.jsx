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
    backgroundColor: state.isFocused ? "#e9ecef" : "#f8f9fa",
    color: state.isFocused ? "#495057" : "#212529",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
};

export const Select = (props) => {
  return <ReactSelect {...props} styles={customStyles} />;
};
export default Select;
