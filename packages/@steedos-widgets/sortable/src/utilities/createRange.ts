const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer
): T[] {
  let array = [];
  let index = 0;

  while(index < length){
    array.push(initializer(index));
    index++;
  }
  return array;
}
