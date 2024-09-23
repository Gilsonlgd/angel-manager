export const args = {
  string: () => {
    return (target: any, propertyKey: string) => {
      if (!target.constructor.arguments) {
        target.constructor.arguments = [];
      }
      target.constructor.arguments.push({
        name: propertyKey,
        type: "string",
      });
    };
  },
};
