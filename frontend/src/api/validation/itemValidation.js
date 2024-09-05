const validateRequired = (value) => !!value.length;

export function validateItem(item) {
  return {
    // itemName: !validateRequired(item.itemName) ? "Item Name is Required" : "",
  };
}
