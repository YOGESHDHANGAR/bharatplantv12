export const selectCustomStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    backgroundColor: "transparent",
    height: "25px",
    minHeight: "25px",
    padding: "0",
    paddingLeft: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "4px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0",
    height: "25px",
    minHeight: "25px",
    display: "flex",
    alignItems: "center",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0 !important",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "inherit",
    margin: "0",
    padding: "0",
    visibility: state.isFocused ? "visible" : "hidden",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "inherit",
    margin: "0",
    padding: "0",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "inherit",
    padding: "0", // Remove padding
    width: "25px", // Set width
    height: "25px", // Set height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    svg: {
      width: "16px", // Adjust the icon size
      height: "16px", // Adjust the icon size
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "0", // Remove padding
    width: "25px", // Set width
    height: "25px", // Set height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    svg: {
      width: "16px", // Adjust the icon size
      height: "16px", // Adjust the icon size
    },
  }),
  menu: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
  }),
  option: (provided) => ({
    ...provided,
    padding: "0",
    paddingLeft: "5px",
  }),
};
