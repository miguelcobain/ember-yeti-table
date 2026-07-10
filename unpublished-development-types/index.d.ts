declare module 'tracked-toolbox' {
  export function localCopy(
    memo: string,
    defaultValue?: unknown,
  ): PropertyDecorator;
  export const dedupeTracked: PropertyDecorator;
}
