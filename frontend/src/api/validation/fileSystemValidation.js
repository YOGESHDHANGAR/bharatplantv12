const validateRequired = (value) => !!value.length;

export function validateFileSystem(fileSystem) {
  return {
    // fileSystemName: !validateRequired(fileSystem.fileSystemName) ? "Bank Name is Required" : "",
  };
}
