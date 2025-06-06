package agentAI

import (
	"app/internal/models"
	"app/pkg/utils"
	"context"
	"fmt"

	Gemini "github.com/google/generative-ai-go/genai"

	"google.golang.org/api/option"
)

const geminiKEY string = "AIzaSyCbtBOlwU1yI7BYxkanm2SPjYykkgh4xnQ"

var (
	ctx   = context.Background()
	model *Gemini.GenerativeModel
)

func InitGeminiOnce() {
	client, err := Gemini.NewClient(ctx, option.WithAPIKey(geminiKEY))
	if err != nil {
		panic(err)
	}
	model = client.GenerativeModel("gemini-2.0-flash-lite")
}

func GeneratePhrase() (models.ModelPhrase, error) {
	command := `
		Task: Generate a single strict JSON object representing a phrase.

		Rules:
		- Return only the JSON object (no code blocks, no explanations).
		- Generate a new, original, and well-structured sentence using vocabulary from the 1000 most common English words.
		- Avoid reusing sentences or structures from previous responses.
		- The sentence must be unique, meaningful, and clearly different on each request.
		- Use any verb in any tense, prioritizing variety and natural expression.
		- Add an "omittedWord" field with two random words from the "English" sentence
		- The Phrase Portuguese must to correspond the Phrase English

		JSON Schema:
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
	dataJSON := string(response.Candidates[0].Content.Parts[0].(Gemini.Text))

	data, err := utils.ParseJSON[models.ModelPhrase](dataJSON)
	if err != nil {
		return models.ModelPhrase{}, err
	}

	return data, nil
}

func UseDictionary(word string) (models.DictionaryEntry, error) {
	command := `
		Task: Return a strict JSON object for the word "%s".

		Rules:
		- Output must be only the JSON object. No text, no comments, no formatting.
		- The JSON must be valid: use double quotes and no trailing commas.
		- Use simple, learner-friendly English in all fields.
		- The example sentence must be natural, common, and end without a period.
	 	- If the word is a verb, format partOfSpeech as: "verb - [tense]".

		JSON Schema:
		{
			"word": string,
			"partOfSpeech": string,
			"definition": string, 
			"example": string,
			"synonyms": [string, string], // two examples
		}
	`
	prompt := Gemini.Text(
		fmt.Sprintf(command, word),
	)

	response, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return models.DictionaryEntry{}, err
	}

	dataJSON := string(response.Candidates[0].Content.Parts[0].(Gemini.Text))
	data, err := utils.ParseJSON[models.DictionaryEntry](dataJSON)
	if err != nil {
		return models.DictionaryEntry{}, err
	}

	return data, nil
}
