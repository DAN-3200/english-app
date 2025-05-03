export function wordPosition(word: string, phrase: string): [number, number] {
   let index = phrase.indexOf(word);

   return [index, index + word.length];
}

export function inAnyRange(n, ...ranges) {
   return ranges.some(([start, end]) => n >= start && n < end);
}
