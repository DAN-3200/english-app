package agentAI

import (
	"app/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"strings"

	Gemini "github.com/google/generative-ai-go/genai"

	"google.golang.org/api/option"
)

const geminiKEY string = "AIzaSyCbtBOlwU1yI7BYxkanm2SPjYykkgh4xnQ"

var (
	ctx    = context.Background()
	client = InitGemini(geminiKEY)
	model  = client.GenerativeModel("gemini-2.0-flash-lite") // muito rápido
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
		Task: Generate a single JSON object representing a phrase.

		Requirements:
		- Return only the JSON object (no code blocks, no explanations).
		- Generate a new, original, and well-structured sentence using vocabulary from the 1000 most common English words.
		- Avoid reusing sentences or structures from previous responses.
		- The sentence must be unique, meaningful, and clearly different on each request.
		- Use any verb in any tense, prioritizing variety and natural expression.
		- Add an "omittedWord" field with two random words from the "English" sentence
		- The Phrase Portuguese must to correspond the Phrase English

		Format:
		{
			"Portuguese": string, // The sentence must not end with a period
			"English": string, // The sentence must not end with a period
			"omittedWord": ["string", "string"] // random words of field "English"
		}
	`
	prompt := Gemini.Text(
		command,
	)

	response, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return models.ModelPhrase{}, err
	}

	var dataJSON = fmt.Sprintf("%s", response.Candidates[0].Content.Parts[0])
	cleanJSON := strings.ReplaceAll(dataJSON, "`", "")
	cleanJSON = strings.ReplaceAll(cleanJSON, "json", "")
	// fmt.Print(cleanJSON)

	var data models.ModelPhrase
	if err := json.Unmarshal([]byte(cleanJSON), &data); err != nil {
		fmt.Println("Error json.Unmarshal", err)
		return models.ModelPhrase{}, err
	}

	return data, nil
}

func UseDictionary(word string) (models.DictionaryEntry, error) {
	command := `
		Task: Generate a single JSON object for the word "%s".

		Requirements:
		- Do not include code blocks, backticks, or explanations.
		- Return only the JSON object.
		- Generate the phrase without a period at the end.

		Format:
		{
			"word": string,
			"partOfSpeech": string, // If it's a verb, specify the verb tense. modelo: verb - [verb tense]
			"definition": string,
			"translation": string, // Translation in Portuguese (pt-br)
			"synonyms": ["string", "string", "string"]
		}
	`
	prompt := Gemini.Text(
		fmt.Sprintf(command, word),
	)

	response, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return models.DictionaryEntry{}, err
	}

	var dataJSON = fmt.Sprintf("%s", response.Candidates[0].Content.Parts[0])
	cleanJSON := strings.ReplaceAll(dataJSON, "`", "")
	cleanJSON = strings.ReplaceAll(cleanJSON, "json", "")
	// fmt.Print(cleanJSON)

	var data models.DictionaryEntry
	if err := json.Unmarshal([]byte(cleanJSON), &data); err != nil {
		fmt.Println("Error json.Unmarshal", err)
		return models.DictionaryEntry{}, err
	}

	return data, nil
}
