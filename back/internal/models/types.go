package models

type ModelPhrase struct {
	Portuguese  string    `json:"Portuguese"`
	English     string    `json:"English"`
	OmittedWord [2]string `json:"omittedWord"`
}

type DictionaryEntry struct {
	Word         string   `json:"word"`
	PartOfSpeech string   `json:"partOfSpeech"`
	Definition   string   `json:"definition"`
	Example      string   `json:"example"`
	Synonyms     []string `json:"synonyms"`
}
