import {
  searchOpenAlexBySource,
  OpenAlexWork,
} from "./openalex";

/**
 * Discover IZA Discussion Papers related to AI + labor.
 * Uses OpenAlex source filtering — avoids fragile IZA website scraping.
 * IZA Discussion Paper Series source ID in OpenAlex: S4306402567
 */
const IZA_SOURCE_ID = "S4306402567";
const SEARCH_KEYWORDS =
  "artificial intelligence OR automation OR machine learning OR labor market OR wages OR employment";

export async function discoverIZAPapers(
  limit = 25
): Promise<OpenAlexWork[]> {
  try {
    return await searchOpenAlexBySource(
      IZA_SOURCE_ID,
      SEARCH_KEYWORDS,
      limit
    );
  } catch (err) {
    console.error("IZA paper discovery failed:", err);
    return [];
  }
}
