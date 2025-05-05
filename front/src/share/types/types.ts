export interface ModelPhrase {
	Portuguese: string;
	English: string;
	omittedWord: [string, string];
}

export interface DictionaryEntry {
	word: string;
	partOfSpeech: string;
	definition: string;
	translation: string;
	synonyms: string[];
}
