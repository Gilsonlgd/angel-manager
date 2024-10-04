export const getObjectFirstProperty = (obj: any): any => {
  const keys = Object.keys(obj);
  if (keys.length > 0) {
    return obj[keys[0]];
  }

  return undefined;
};
