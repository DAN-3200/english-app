import { atom } from 'jotai';
import { DictionaryEntry, ModelPhrase } from '../types/types';

// export const ctxMain = {};

export const ctxType = {
   textTyping: atom<string>(''),
   modelPhrase: atom<ModelPhrase>({
      Portuguese: 'Nothing',
      English: 'Nothing',
      omittedWord: ['...', '...'],
   } as ModelPhrase),
   wordInfo: atom<DictionaryEntry| null>(null),
};

export const ctxModal = {
   onModal: atom<string|null>(null)
}