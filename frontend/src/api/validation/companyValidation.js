const validateRequired = (value) => !!value.length;

export function validateCompany(company) {
  return {
    // companyName: !validateRequired(company.companyName)
    //   ? "Company Name is Required"
    //   : "",
  };
}
