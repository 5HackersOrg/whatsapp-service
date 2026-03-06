export const applyMixins = (derivedCls: any, baseCls: any[]) => {
  baseCls.forEach((base) => {
    Object.getOwnPropertyNames(base.prototype).forEach((name) => {
      if (name !== "constructor") {
        Object.defineProperty(
          derivedCls.prototype,
          name,
          Object.getOwnPropertyDescriptor(base.prototype, name) ||
            Object.create(null),
        );
      }
    });
  });
};
