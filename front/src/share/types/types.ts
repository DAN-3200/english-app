export interface ModelPhrase {
	Portuguese: string;
	English: string;
	omittedWord: [string, string];
}

export interface DictionaryEntry {
	word: string;
	partOfSpeech: string;
	definition: string;
	example: string;
	synonyms: string[];
}
