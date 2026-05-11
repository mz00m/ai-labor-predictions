/**
 * Pre-render BOTH counties and MSAs as Albers-USA-projected SVG path strings.
 * MSAs are built by topojson-merging the arcs of their constituent counties
 * via the Census CBSA delineation crosswalk.
 *
 * Outputs:
 *   src/data/regional/us-counties-svg-paths.json  (~3,200 counties)
 *   src/data/regional/us-msas-svg-paths.json      (~935 CBSAs)
 *
 * Run: npm run build:county-msa-svg
 */
import { promises as fs } from "fs";
import path from "path";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mergeArcs } from "topojson-client";
import type { GeometryCollection, MultiPolygon, Polygon, Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";

import countiesTopo from "us-atlas/counties-10m.json";
import crosswalk from "../src/data/regional/cbsa-county-crosswalk.json";

interface PathRow {
  id: string;
  name: string;
  d: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

interface MsaPathRow extends PathRow {
  type: string;       // "Metropolitan Statistical Area" | "Micropolitan Statistical Area"
  primState: string;  // first 2 digits of the first county FIPS
  counties: string[]; // member county FIPS
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const WIDTH = 975;
  const HEIGHT = 610;

  const projection = geoAlbersUsa().scale(1300).translate([WIDTH / 2, HEIGHT / 2]);
  const pather = geoPath(projection);

  const topo = countiesTopo as unknown as Topology;
  const countiesObj = topo.objects.counties as GeometryCollection<{ name: string }>;

  // ─── Counties ──────────────────────────────────────────────────
  const countyFC = feature(topo, countiesObj) as FeatureCollection<Geometry, { name: string }>;
  const counties: PathRow[] = [];
  for (const f of countyFC.features) {
    const id = String(f.id).padStart(5, "0");
    const d = pather(f as any) ?? "";
    if (!d) continue;
    const c = pather.centroid(f as any);
    const b = pather.bounds(f as any);
    counties.push({
      id,
      name: f.properties?.name ?? id,
      d,
      centroid: [Math.round(c[0]), Math.round(c[1])],
      bbox: [Math.round(b[0][0]), Math.round(b[0][1]), Math.round(b[1][0]), Math.round(b[1][1])],
    });
  }

  await fs.writeFile(
    path.join(root, "src/data/regional/us-counties-svg-paths.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      projection: "albersUsa",
      width: WIDTH,
      height: HEIGHT,
      source: "us-atlas v3 (counties-10m.json)",
      counties: counties.sort((a, b) => a.id.localeCompare(b.id)),
    }),
  );
  console.error(`Wrote us-counties-svg-paths.json — ${counties.length} counties`);

  // ─── MSAs (merged from counties) ───────────────────────────────
  // Build cbsa -> array of county geometry objects (with id) using the
  // crosswalk. We then mergeArcs to produce a single multipolygon per CBSA.
  const cbsaCounties = new Map<string, Set<string>>();
  for (const cbsa of crosswalk.cbsas) {
    cbsaCounties.set(
      cbsa.cbsa,
      new Set(cbsa.counties.map((c: { fips: string }) => c.fips)),
    );
  }

  // We need raw geometry objects (not features) for mergeArcs. Build a quick
  // index from county geometry id -> geometry.
  const geomByFips = new Map<string, Polygon | MultiPolygon>();
  for (const g of countiesObj.geometries) {
    const id = String((g as { id: string | number }).id).padStart(5, "0");
    geomByFips.set(id, g as Polygon | MultiPolygon);
  }

  const msas: MsaPathRow[] = [];
  for (const cbsa of crosswalk.cbsas) {
    const fipsSet = cbsaCounties.get(cbsa.cbsa)!;
    const memberGeoms: (Polygon | MultiPolygon)[] = [];
    for (const fips of fipsSet) {
      const g = geomByFips.get(fips);
      if (g) memberGeoms.push(g);
    }
    if (memberGeoms.length === 0) continue;

    const merged = mergeArcs(topo, memberGeoms);
    const f = feature(topo, merged) as any; // GeoJSON feature
    const d = pather(f) ?? "";
    if (!d) continue;
    const c = pather.centroid(f);
    const b = pather.bounds(f);

    const primState = Array.from(fipsSet)[0].slice(0, 2);

    msas.push({
      id: cbsa.cbsa,
      name: cbsa.title,
      type: cbsa.type,
      primState,
      counties: Array.from(fipsSet),
      d,
      centroid: [Math.round(c[0]), Math.round(c[1])],
      bbox: [Math.round(b[0][0]), Math.round(b[0][1]), Math.round(b[1][0]), Math.round(b[1][1])],
    });
  }

  await fs.writeFile(
    path.join(root, "src/data/regional/us-msas-svg-paths.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      projection: "albersUsa",
      width: WIDTH,
      height: HEIGHT,
      source: "us-atlas counties-10m merged via Census 2023 CBSA delineation",
      cbsas: msas.sort((a, b) => a.id.localeCompare(b.id)),
    }),
  );
  console.error(`Wrote us-msas-svg-paths.json — ${msas.length} CBSAs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
