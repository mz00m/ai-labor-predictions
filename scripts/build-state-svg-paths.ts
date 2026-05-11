/**
 * Pre-render the US states (Albers USA projection) as SVG path strings, so
 * the /map page can render a choropleth inline with zero client-side
 * projection / topojson work.
 *
 * Output: src/data/regional/us-states-svg-paths.json
 *
 * Run: npm run build:state-svg
 */
import { promises as fs } from "fs";
import path from "path";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";

// us-atlas ships pure topojson; the npm package's main field points at the JSON.
// states-10m.json is ~250 KB raw, ~80 KB once gzipped over the wire.
import statesTopo from "us-atlas/states-10m.json";

interface StatePath {
  id: string;           // FIPS code, 2 digits as string ("01" .. "56")
  name: string;
  d: string;            // SVG path "M…Z"
  centroid: [number, number];
  bbox: [number, number, number, number]; // x0, y0, x1, y1 for hit-testing later
}

async function main() {
  const root = path.resolve(__dirname, "..");

  const WIDTH = 975;
  const HEIGHT = 610;

  const projection = geoAlbersUsa()
    .scale(1300)
    .translate([WIDTH / 2, HEIGHT / 2]);

  const pather = geoPath(projection);

  // topojson types are loose; cast through unknown.
  const collection = feature(
    statesTopo as unknown as Parameters<typeof feature>[0],
    (statesTopo as any).objects.states,
  ) as FeatureCollection<Geometry, { name: string }>;

  const paths: StatePath[] = [];
  for (const feat of collection.features) {
    const id = String(feat.id).padStart(2, "0");
    const d = pather(feat as any) ?? "";
    const c = pather.centroid(feat as any);
    const b = pather.bounds(feat as any);
    paths.push({
      id,
      name: feat.properties?.name ?? id,
      d,
      centroid: [Math.round(c[0]), Math.round(c[1])],
      bbox: [Math.round(b[0][0]), Math.round(b[0][1]), Math.round(b[1][0]), Math.round(b[1][1])],
    });
  }

  // Drop territories that AlbersUSA doesn't render (path is empty)
  const renderable = paths.filter((p) => p.d.length > 0);

  const out = {
    generatedAt: new Date().toISOString(),
    projection: "albersUsa",
    width: WIDTH,
    height: HEIGHT,
    source: "us-atlas v3 (states-10m.json)",
    states: renderable.sort((a, b) => a.id.localeCompare(b.id)),
  };

  const outPath = path.join(root, "src/data/regional/us-states-svg-paths.json");
  await fs.writeFile(outPath, JSON.stringify(out));
  console.error(`Wrote ${outPath} — ${renderable.length} states, ${out.width}x${out.height}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
