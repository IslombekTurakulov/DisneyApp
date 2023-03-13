const SEARCH_URL = "https://api.disneyapi.dev/character?name=";
const ALL_CHARACTERS_URL = "https://api.disneyapi.dev/characters?page=";
const CHARACTERS_ID_URL = "https://api.disneyapi.dev/characters/";

export const searchCharacter = async (query) => {
  const url = query ? `${SEARCH_URL}${query}` : ALL_CHARACTERS_URL + 1;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllCharacters = async (query) => {
  const url = `${ALL_CHARACTERS_URL}${query}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getCharacterDetails = async (query) => {
  try {
    const response = await fetch(CHARACTERS_ID_URL + query);
    const json = await response.json();
    console.log(json)
    return json;
  } catch (error) {
    console.log(error);
    return [];
  }
}
