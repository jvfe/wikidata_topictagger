async function queryAPI(url) {
  try {
    const request = await fetch(url, {
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
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${term}&language=en&format=json&origin=*`;
  const queryResult = await queryAPI(url);
  const parsedResult = parseWikibaseResults(queryResult);
  return parsedResult;
}

async function querySPARQLService(qid, qidLabel) {
  /* eslint-disable */
  const query = `
    SELECT 
    DISTINCT 
    (REPLACE(STR(?item), ".*Q", "Q") AS ?qid) 
    ("P921" AS ?property)
    ("${qid}" AS ?ReplaceWithYourTargetID)
    ("S887" AS ?heuristic)
    ("Q69652283" AS ?deduced)

      WHERE {
        hint:Query hint:optimizer "None".
        
      {  
        SERVICE wikibase:mwapi {
          bd:serviceParam wikibase:api "Search";
                          wikibase:endpoint "www.wikidata.org";
                          mwapi:srsearch "\\"${qidLabel}\\" haswbstatement:P31=Q13442814 -haswbstatement:P921=${qid}".
            ?page_title wikibase:apiOutput mwapi:title.
        }
      }
        
        BIND(IRI(CONCAT(STR(wd:), ?page_title)) AS ?item)
        ?item wdt:P1476 ?title.
        FILTER CONTAINS(LCASE(?title), "${qidLabel.toLowerCase()}").
      } LIMIT 300
  `;
  /* eslint-enable */

  const encodedQuery = encodeURIComponent(query);
  const url = `https://query.wikidata.org/sparql?query=${encodedQuery}`;

  const queryRequest = await fetch(url, {
    mode: "cors",
    headers: { Accept: "text/csv" }
  });

  const queryResult = await queryRequest.text();

  // Removes the result header
  const resultArray = queryResult.split("\n");

  resultArray.splice(0, 1);

  const cleanResult = resultArray.join("\n").replaceAll(",", "|");

  return cleanResult;
}
export { searchWikibase, querySPARQLService };
