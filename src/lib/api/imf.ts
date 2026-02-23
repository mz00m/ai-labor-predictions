import {
  searchOpenAlexByInstitution,
  OpenAlexWork,
} from "./openalex";

/**
 * Discover IMF working papers and staff discussion notes related to AI + labor.
 * Uses OpenAlex as a reliable backend — avoids fragile IMF website scraping.
 * IMF institution ID in OpenAlex: I107986439
 */
const IMF_INSTITUTION_ID = "I107986439";
const SEARCH_KEYWORDS =
  "artificial intelligence OR automation OR labor market OR employment OR workforce";

export async function discoverIMFPapers(
  limit = 25
): Promise<OpenAlexWork[]> {
  try {
    return await searchOpenAlexByInstitution(
      IMF_INSTITUTION_ID,
      SEARCH_KEYWORDS,
      limit
    );
  } catch (err) {
    console.error("IMF paper discovery failed:", err);
    return [];
  }
}
