export type SlugMap<T, L extends string> = {
  [K in L]: T
}