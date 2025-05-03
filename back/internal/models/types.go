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
	Translation  string   `json:"translation"`
	Synonyms     []string `json:"synonyms"`
}
