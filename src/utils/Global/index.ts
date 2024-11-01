globalThis.isNullOrUndefined = function (source: any) {
  return source === null || source === undefined;
};
globalThis.getDataWithDefault = function <T>(source: T, def: T) {
  return isNullOrUndefined(source) ? def : source;
};
