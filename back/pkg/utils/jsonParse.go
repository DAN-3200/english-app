package utils

import (
	"encoding/json"
	"strings"
)

var cleaner = strings.NewReplacer("`", "", "json", "")

func ParseJSON[T any](raw any) (T, error) {
	clean := cleaner.Replace(raw.(string))

	var result T
	if err := json.Unmarshal([]byte(clean), &result); err != nil {
		return result, err
	}
	return result, nil
}