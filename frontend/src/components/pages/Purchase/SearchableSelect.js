import React, { useState } from "react";

import Select from "react-select";
// import { colourOptions } from "../data";
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default () => {
  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={colourOptions[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name="color"
        options={options}
      />
    </>
  );
};
