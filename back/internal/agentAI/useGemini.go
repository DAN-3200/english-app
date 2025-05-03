package agentAI

import (
	"app/internal/models"
	"context"
	"encoding/json"
	"fmt"

	Gemini "github.com/google/generative-ai-go/genai"

	"google.golang.org/api/option"
)

const geminiKEY string = "AIzaSyCbtBOlwU1yI7BYxkanm2SPjYykkgh4xnQ"

var (
	ctx    = context.Background()
	client = InitGemini(geminiKEY)
	model  = client.GenerativeModel("gemini-1.5-flash")
)

func InitGemini(Key string) *Gemini.Client {
	client, err := Gemini.NewClient(ctx, option.WithAPIKey(geminiKEY))
	if err != nil {
		return nil
	}
	return client
}

func GeneratePhrase() (models.ModelPhrase, error) {
	command := `
	Generate one content in the following JSON model, without using code blocks or backticks:

	Phrase{
		Portuguese: string,
		English: string, // without 
		omittedWord: [string, string] // of Phrase.English
	}

	Return only the JSON, with no explanation and no formatting markers.
	`
	prompt := Gemini.Text(
		command,
	)

	response, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return models.ModelPhrase{}, err
	}

	var dataJSON = fmt.Sprintf("%s", response.Candidates[0].Content.Parts[0])

	var data models.ModelPhrase
	if err := json.Unmarshal([]byte(dataJSON), &data); err != nil {
		fmt.Println("Error json.Unmarshal", err)
		return models.ModelPhrase{}, err
	}

	return data, nil
}

func UseDictionary(word string) (models.DictionaryEntry, error) {
	command := `
		Generate one content in the following JSON model of word ´%s´, without using code blocks or backticks:

		DictionaryEntry {
			word: string, // the input word
			partOfSpeech: string, // grammatical category of the word
			definition: string, // definition in English
			translation: string, // translation to Portuguese
			synonyms: [string, string, string] // three related words in English
		}

		Return only the JSON, with no explanation and no formatting markers. Use the word I provide as input.
	`
	prompt := Gemini.Text(
		fmt.Sprintf(command, word),
	)

	response, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return models.DictionaryEntry{}, err
	}

	var dataJSON = fmt.Sprintf("%s", response.Candidates[0].Content.Parts[0])

	var data models.DictionaryEntry
	if err := json.Unmarshal([]byte(dataJSON), &data); err != nil {
		fmt.Println("Error json.Unmarshal", err)
		return models.DictionaryEntry{}, err
	}

	return data, nil
}
