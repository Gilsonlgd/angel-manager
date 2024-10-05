import path from "path";
import { fileURLToPath } from "url";

export const filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(filename);

export const getObjectFirstProperty = (obj: {
  [key: string]: string | number | Record<string, string | number>;
}): string | number | Record<string, string | number> | undefined => {
  const keys = Object.keys(obj);
  if (keys.length > 0) {
    return obj[keys[0]];
  }

  return undefined;
};
