import axios from "axios";
const PLACES_API = process.env.PLACES_API;
const insertSuggestion = (obj: any, suggestions: string[]) => {
  suggestions.push(obj.placePrediction.text.text);
};
export const makeSuggestions = async (text: string) => {
  try {
    const res = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      { input: text },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API,
          "X-Goog-FieldMask": "suggestions.placePrediction.text",
        },
      },
    );

    const suggestions_data = res.data.suggestions;
    const suggestions: string[] = [];
    const end = Math.min(5, suggestions_data.length);
    for (let i = 0; i < end; i++) {
      insertSuggestion(suggestions_data[i], suggestions);
    }
    return suggestions;
  } catch (err) {
    console.log(err);
    return [];
  }
};
