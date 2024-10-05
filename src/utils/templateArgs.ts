import { Arg } from "@core";

export const argsObject: {
  base: Record<string, string | number>;
  camel: Record<string, string | number>;
  kebab: Record<string, string | number>;
  snake: Record<string, string | number>;
  pascal: Record<string, string | number>;
  plural: {
    camel: Record<string, string | number>;
    kebab: Record<string, string | number>;
    snake: Record<string, string | number>;
    pascal: Record<string, string | number>;
  };
} = {
  base: {},
  camel: {},
  kebab: {},
  snake: {},
  pascal: {},
  plural: {
    camel: {},
    kebab: {},
    snake: {},
    pascal: {},
  },
};

export const generateArgsString = (args: Arg[]) => {
  return args.map((arg) => `<${arg.name}>`).join(" ");
};