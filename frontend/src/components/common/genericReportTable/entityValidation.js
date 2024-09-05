const validateRequired = (value) => !!value.length;

export function validateEntity(entity) {
  return {
    // entityName: !validateRequired(entity.entityName)
    //   ? "Entity Name is Required"
    //   : "",
  };
}
