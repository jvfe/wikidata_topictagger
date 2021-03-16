async function queryAPI(url) {
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const queryURL = `${proxy}${url}`;
  try {
    const request = await fetch(queryURL, {
      mode: "cors"
    });
    const result = await request.json();
    return result;
  } catch (error) {
    throw Error(error);
  }
}

function parseWikibaseResults(result) {
  const parsed = result.search.map(el => {
    return { id: el.id, label: el.label, description: el.description };
  });
  return parsed;
}

async function searchWikibase(term) {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${term}&language=en&format=json`;
  const queryResult = await queryAPI(url);
  const parsedResult = parseWikibaseResults(queryResult);
  return parsedResult;
}

export default searchWikibase;
