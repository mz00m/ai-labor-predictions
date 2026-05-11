"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapCanvas, { GeoFeature } from "./MapCanvas";
import MapSearch, { SearchResult } from "./MapSearch";
import ExplorerSidebar, {
  CountySidebarData,
  MsaSidebarData,
  NationalSummary,
  StateSidebarData,
} from "./ExplorerSidebar";
import { formatJobs, riskColor100 } from "./types";

/* ---------- Input data shapes ---------- */

interface StateRiskRow {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number;
  matchedEmployment: number;
  /** Sum of employment scored either directly or via SOC major-group fallback. */
  fullEmployment?: number;
  coverage: number;
  /** Coverage after major-group fallback (~97-100%). */
  fullCoverage?: number;
  /** Matched-only employment-weighted risk (legacy). */
  weightedNetRisk100: number;
  weightedNetRisk: number;
  /** Honest headline: matched + SOC major-group fallback for unscored ~half of state employment. */
  weightedNetRisk100Full?: number;
  weightedPctHighRiskTime: number;
  topRiskOccupations: { slug: string; title: string; employment: number; netRisk100: number }[];
  occupationCount: number;
}
interface StateRiskFile { states: StateRiskRow[] }

interface StatePath {
  id: string; name: string; d: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}
interface StatePathsFile { states: StatePath[]; width: number; height: number }

interface MsaPath {
  id: string; name: string; type: string; primState: string;
  counties: string[]; d: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}
interface MsaPathsFile { cbsas: MsaPath[]; width: number; height: number }

interface CountyPath {
  id: string; name: string; d: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}
interface CountyPathsFile { counties: CountyPath[]; width: number; height: number }

interface MsaSummaryRow {
  cbsa: string;
  title: string;
  primState: string;
  type: string;
  totalEmployment: number;
  matchedEmployment?: number;
  fullEmployment?: number;
  /** Matched-only coverage (legacy ~50%). */
  coverage?: number;
  /** Coverage after SOC major-group fallback (~88-99%). */
  fullCoverage?: number;
  /** Matched-only employment-weighted risk. */
  weightedNetRisk100: number;
  /** Honest headline: matched + SOC major-group fallback risk. */
  weightedNetRisk100Full?: number;
  occupationCount: number;
  topRiskOccupations: { slug: string; title: string; employment: number; netRisk100: number }[];
}
interface MsaSummaryFile { areas: MsaSummaryRow[] }

interface CbsaSummaryRow {
  cbsa: string;
  title: string;
  type: string;
  category: "metro" | "micro";
  primState: string;
  countyCount: number;
  totalEmployment: number;
  weightedNetRisk100: number;
  topGroups: { slug: string; employment: number; share: number; netRisk100: number }[];
  source: string;
}
interface CbsaSummaryFile { cbsas: CbsaSummaryRow[] }

interface CountyRiskRow {
  fips: string;
  name: string;
  stateFips: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  topGroups: { slug: string; share: number; netRisk100: number }[];
}
interface CountyRiskFile { counties: CountyRiskRow[] }

interface CrosswalkFile {
  countyToCbsa: Record<string, string>;
  cbsas: { cbsa: string; title: string; type: string; counties: { fips: string; name: string; role: string }[] }[];
}

interface OccupationLite { slug: string; title: string }

interface MsaOccRow {
  cbsa: string;
  title: string;
  primState: string;
  type: string;
  totalEmployment: number;
  topOccupations: {
    slug: string; soc?: string; title: string;
    employment: number; medianWage?: number | null;
    netRisk100: number; category: string; share: number;
  }[];
}
interface MsaOccFile { areas: MsaOccRow[] }

interface CountyOccRow {
  fips: string;
  name: string;
  stateFips: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  occupationGroups: { slug: string; employment: number; share: number; netRisk100: number }[];
}
interface CountyOccFile { counties: CountyOccRow[] }

interface Props {
  stateRisk: StateRiskFile;
  statePaths: StatePathsFile;
  msaPaths: MsaPathsFile;
  msaSummary: MsaSummaryFile;
  /** ACS county-aggregated CBSA summary covering metros + micros (935 total). */
  cbsaSummary?: CbsaSummaryFile;
  countyRisk: CountyRiskFile;
  crosswalk: CrosswalkFile;
  occupations: OccupationLite[];
}

type ViewMode = "country" | "metro" | "county";
type Metric = "netRisk" | "pctHigh";

interface Selection {
  view: ViewMode;
  id: string | null;
}

/* ---------- Helpers ---------- */

const MAP_WIDTH = 975;
const MAP_HEIGHT = 610;

function computeTransform(
  bbox: [number, number, number, number],
  pad = 18,
): { transform: string; scale: number } {
  const [x0, y0, x1, y1] = bbox;
  const w = Math.max(1, x1 - x0);
  const h = Math.max(1, y1 - y0);
  // Account for padding in target frame
  const target = {
    w: MAP_WIDTH - pad * 2,
    h: MAP_HEIGHT - pad * 2,
  };
  // Cap scale so small features don't blow up too much (counties/MSAs).
  const scale = Math.min(target.w / w, target.h / h, 8);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const tx = MAP_WIDTH / 2 - cx * scale;
  const ty = MAP_HEIGHT / 2 - cy * scale;
  return {
    transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${scale.toFixed(3)})`,
    scale,
  };
}

/* ---------- Lazy loader ---------- */

// Module-level cache so the JSON survives view-toggles inside a single tab.
const lazyCache: Map<string, Promise<unknown>> = new Map();

function useLazyJson<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    let p = lazyCache.get(url) as Promise<T> | undefined;
    if (!p) {
      p = fetch(url).then((r) => {
        if (!r.ok) throw new Error(`fetch ${url} ${r.status}`);
        return r.json() as Promise<T>;
      });
      lazyCache.set(url, p);
    }
    p.then((j) => {
        if (cancelled) return;
        setData(j);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
        setLoading(false);
        lazyCache.delete(url);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

/* ---------- Component ---------- */

export default function RegionalExplorer({
  stateRisk,
  statePaths,
  msaPaths,
  msaSummary,
  cbsaSummary: _cbsaSummary, // accepted for future metro/micro merge; not yet rendered
  countyRisk,
  crosswalk,
  occupations,
}: Props) {
  const [view, setView] = useState<ViewMode>("county");
  const [selection, setSelection] = useState<Selection>({ view: "county", id: null });
  // Country view defaults to %pctHighRiskTime — it has 5× the dynamic range
  // of weighted net risk (16-32% vs. 51-54), so it's the more useful default
  // metric. Metro/county fall back to netRisk since pctHigh isn't computed there.
  const [metric, setMetric] = useState<Metric>("pctHigh");
  // Quantile is the honest default for the narrow range — bins regions into 5
  // groups by rank, which gives clear contrast without overstating absolute
  // magnitude (the way stretched min-max does).
  const [scaleMode, setScaleMode] = useState<"quantile" | "absolute" | "stretched">("quantile");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Lookups */
  const stateByFips = useMemo(() => {
    const m = new Map<string, StateRiskRow>();
    for (const s of stateRisk.states) m.set(s.fips, s);
    return m;
  }, [stateRisk]);

  const stateBoxes = useMemo(() => {
    const m = new Map<string, StatePath>();
    for (const s of statePaths.states) m.set(s.id, s);
    return m;
  }, [statePaths]);

  const msaSummaryByCbsa = useMemo(() => {
    const m = new Map<string, MsaSummaryRow>();
    for (const r of msaSummary.areas) m.set(r.cbsa, r);
    return m;
  }, [msaSummary]);

  const msaPathByCbsa = useMemo(() => {
    const m = new Map<string, MsaPath>();
    for (const r of msaPaths.cbsas) m.set(r.id, r);
    return m;
  }, [msaPaths]);

  const countyRiskByFips = useMemo(() => {
    const m = new Map<string, CountyRiskRow>();
    for (const c of countyRisk.counties) m.set(c.fips, c);
    return m;
  }, [countyRisk]);

  const cbsaInfo = useMemo(() => {
    const m = new Map<string, CrosswalkFile["cbsas"][number]>();
    for (const c of crosswalk.cbsas) m.set(c.cbsa, c);
    return m;
  }, [crosswalk]);

  /* Lazy-loaded layers (county paths + per-MSA / per-county occ files). */
  const countyPathsUrl = view === "county" ? "/data/us-counties-svg-paths.json" : null;
  const { data: countyPaths } = useLazyJson<CountyPathsFile>(countyPathsUrl);

  const msaOccUrl = selection.view === "metro" && selection.id ? "/data/msa-occupation-employment.json" : null;
  const { data: msaOccFile, loading: msaOccLoading } = useLazyJson<MsaOccFile>(msaOccUrl);
  const msaOccByCbsa = useMemo(() => {
    const m = new Map<string, MsaOccRow>();
    if (msaOccFile) for (const r of msaOccFile.areas) m.set(r.cbsa, r);
    return m;
  }, [msaOccFile]);

  const countyOccUrl = selection.view === "county" && selection.id ? "/data/county-occupation-employment.json" : null;
  const { data: countyOccFile, loading: countyOccLoading } = useLazyJson<CountyOccFile>(countyOccUrl);
  const countyOccByFips = useMemo(() => {
    const m = new Map<string, CountyOccRow>();
    if (countyOccFile) for (const r of countyOccFile.counties) m.set(r.fips, r);
    return m;
  }, [countyOccFile]);

  /* Active layer features + value lookup */
  const layer = useMemo<{
    features: GeoFeature[];
    background?: GeoFeature[];
    valueOf: (id: string) => number | null;
    nameOf: (id: string) => string;
    employmentOf: (id: string) => number;
  }>(() => {
    if (view === "country") {
      const features: GeoFeature[] = statePaths.states.map((s) => ({
        id: s.id,
        name: s.name,
        d: s.d,
        centroid: s.centroid,
        bbox: s.bbox,
      }));
      return {
        features,
        valueOf: (id) => {
          const s = stateByFips.get(id);
          if (!s) return null;
          if (metric === "pctHigh") return s.weightedPctHighRiskTime;
          // Prefer the SOC-major-group fallback-augmented score (~97-100% coverage);
          // fall back to the matched-only score if the field isn't present.
          return s.weightedNetRisk100Full ?? s.weightedNetRisk100;
        },
        nameOf: (id) => stateByFips.get(id)?.title ?? id,
        employmentOf: (id) => stateByFips.get(id)?.totalEmployment ?? 0,
      };
    }
    if (view === "metro") {
      // Only foreground polygons we have risk data for (~393 metros).
      const features: GeoFeature[] = msaPaths.cbsas
        .filter((c) => msaSummaryByCbsa.has(c.id))
        .map((c) => ({
          id: c.id,
          name: c.name,
          d: c.d,
          centroid: c.centroid,
          bbox: c.bbox,
        }));
      // Use state polygons as faded background so the country silhouette stays visible
      // behind the metro patches.
      const background: GeoFeature[] = statePaths.states.map((s) => ({
        id: `state-${s.id}`,
        name: s.name,
        d: s.d,
        centroid: s.centroid,
        bbox: s.bbox,
      }));
      return {
        features,
        background,
        valueOf: (id) => {
          const m = msaSummaryByCbsa.get(id);
          if (!m) return null;
          // Prefer the SOC-major-group fallback-augmented score (~88-99% coverage);
          // fall back to matched-only if the field isn't present.
          return m.weightedNetRisk100Full ?? m.weightedNetRisk100;
        },
        nameOf: (id) => msaSummaryByCbsa.get(id)?.title ?? msaPathByCbsa.get(id)?.name ?? id,
        employmentOf: (id) => msaSummaryByCbsa.get(id)?.totalEmployment ?? 0,
      };
    }
    // county view
    const features: GeoFeature[] = countyPaths
      ? countyPaths.counties.map((c) => ({
          id: c.id,
          name: c.name,
          d: c.d,
          centroid: c.centroid,
          bbox: c.bbox,
        }))
      : [];
    const background: GeoFeature[] = statePaths.states.map((s) => ({
      id: `state-${s.id}`,
      name: s.name,
      d: s.d,
      centroid: s.centroid,
      bbox: s.bbox,
    }));
    return {
      features,
      background,
      valueOf: (id) => countyRiskByFips.get(id)?.weightedNetRisk100 ?? null,
      nameOf: (id) => countyRiskByFips.get(id)?.name ?? id,
      employmentOf: (id) => countyRiskByFips.get(id)?.totalEmployment ?? 0,
    };
  }, [
    view,
    statePaths,
    msaPaths,
    countyPaths,
    stateByFips,
    msaSummaryByCbsa,
    msaPathByCbsa,
    countyRiskByFips,
    metric,
  ]);

  /* Color scale modes:
   *
   * - quantile (default): bin regions into 5 rank groups; each bin gets one
   *   color from the green→red palette. Honest about ordinal differences
   *   without falsely implying large absolute magnitude differences.
   * - stretched: legend pinned to observed min/max so a 3-point spread fills
   *   the gradient. Useful for fine-grained ranking, but contrast can mislead.
   * - absolute: 0-100 scale. Tells the literal model output (most regions
   *   are amber), but visually uniform when ranges are narrow. */
  const QUANTILE_COLORS = ["#16A34A", "#84CC16", "#FBBF24", "#F59E0B", "#DC2626"];

  const colorBy = useMemo(() => {
    const values: { id: string; v: number }[] = [];
    let min = Infinity;
    let max = -Infinity;
    for (const f of layer.features) {
      const v = layer.valueOf(f.id);
      if (v == null || !Number.isFinite(v)) continue;
      values.push({ id: f.id, v });
      if (v < min) min = v;
      if (v > max) max = v;
    }

    if (scaleMode === "quantile") {
      // Compute quintile thresholds from the actual distribution
      const sorted = values.map((x) => x.v).sort((a, b) => a - b);
      const n = sorted.length;
      const q = (p: number) => sorted[Math.max(0, Math.min(n - 1, Math.floor(p * n)))];
      const thresholds = [q(0.2), q(0.4), q(0.6), q(0.8)];
      const colorIndex = (v: number) => {
        for (let i = 0; i < thresholds.length; i++) {
          if (v < thresholds[i]) return i;
        }
        return thresholds.length;
      };
      return (id: string) => {
        const v = layer.valueOf(id);
        if (v == null) return "#F3F4F6";
        return QUANTILE_COLORS[colorIndex(v)];
      };
    }

    const span = Math.max(0.001, max - min);
    return (id: string) => {
      const v = layer.valueOf(id);
      if (v == null) return "#F3F4F6";
      if (scaleMode === "stretched") {
        return riskColor100(((v - min) / span) * 100);
      }
      return riskColor100(v);
    };
  }, [layer, scaleMode]);

  /* Selected feature bbox -> transform */
  const transform = useMemo(() => {
    if (!selection.id) return undefined;
    if (selection.view === "country") return computeTransform(stateBoxes.get(selection.id)?.bbox ?? [0, 0, MAP_WIDTH, MAP_HEIGHT]).transform;
    if (selection.view === "metro") return computeTransform(msaPathByCbsa.get(selection.id)?.bbox ?? [0, 0, MAP_WIDTH, MAP_HEIGHT]).transform;
    if (selection.view === "county") {
      const f = countyPaths?.counties.find((c) => c.id === selection.id);
      if (!f) return undefined;
      return computeTransform(f.bbox).transform;
    }
    return undefined;
  }, [selection, stateBoxes, msaPathByCbsa, countyPaths]);

  /* Selection helpers */
  const focusState = useCallback((fips: string) => {
    setView("country");
    setSelection({ view: "country", id: fips });
  }, []);
  const focusMsa = useCallback((cbsa: string) => {
    setView("metro");
    setSelection({ view: "metro", id: cbsa });
  }, []);
  const focusCounty = useCallback((fips: string) => {
    setView("county");
    setSelection({ view: "county", id: fips });
  }, []);
  const reset = useCallback(() => {
    setSelection({ view, id: null });
  }, [view]);

  /* Keep selection consistent with view */
  useEffect(() => {
    if (selection.view !== view) {
      setSelection({ view, id: null });
    }
  }, [view, selection.view]);

  /* Search */
  const searchResults = useMemo(() => {
    return {
      states: stateRisk.states.map((s) => ({ id: s.fips, name: s.title, abbr: s.abbr })),
      msas: msaPaths.cbsas.map((m) => ({ id: m.id, name: m.name, primState: m.primState })),
      counties: countyRisk.counties.map((c) => ({ id: c.fips, name: c.name })),
      occupations: occupations.map((o) => ({ slug: o.slug, name: o.title })),
    };
  }, [stateRisk, msaPaths, countyRisk, occupations]);

  const onSearchSelect = useCallback(
    (r: SearchResult) => {
      if (r.kind === "state") focusState(r.id);
      else if (r.kind === "msa") focusMsa(r.id);
      else if (r.kind === "county") focusCounty(r.id);
      // occupation case: handled inline (Link). No-op here.
    },
    [focusState, focusMsa, focusCounty],
  );

  /* Hover -> tooltip following cursor */
  const onHover = useCallback(
    (id: string | null, evt: React.MouseEvent | null) => {
      setHoverId(id);
      if (!id || !evt || !containerRef.current) {
        setTooltip(null);
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
    },
    [],
  );

  /* Build sidebar payload */
  const sidebar = useMemo(() => {
    if (!selection.id) {
      const national: NationalSummary = {
        stateCount: stateRisk.states.length,
        totalEmployment: stateRisk.states.reduce((s, x) => s + x.totalEmployment, 0),
        averageWeightedRisk:
          stateRisk.states.reduce(
            (s, x) => s + x.weightedNetRisk100 * x.totalEmployment,
            0,
          ) /
          Math.max(1, stateRisk.states.reduce((s, x) => s + x.totalEmployment, 0)),
        occupationCount: occupations.length,
      };
      return { kind: "default" as const, national };
    }
    if (selection.view === "country") {
      const s = stateByFips.get(selection.id);
      if (!s) return null;
      // Top metros in state — filter msa-summary by primState abbr (msa-summary primState is abbr, e.g. "TX")
      const metros = msaSummary.areas
        .filter((m) => m.primState === s.abbr)
        .sort((a, b) => b.totalEmployment - a.totalEmployment)
        .slice(0, 5)
        .map((m) => ({
          cbsa: m.cbsa,
          title: m.title,
          totalEmployment: m.totalEmployment,
          weightedNetRisk100: m.weightedNetRisk100,
        }));
      const data: StateSidebarData = {
        fips: s.fips,
        abbr: s.abbr,
        title: s.title,
        totalEmployment: s.totalEmployment,
        weightedNetRisk100: s.weightedNetRisk100Full ?? s.weightedNetRisk100,
        weightedPctHighRiskTime: s.weightedPctHighRiskTime,
        coverage: s.fullCoverage ?? s.coverage,
        topRiskOccupations: s.topRiskOccupations,
        topMetrosInState: metros,
      };
      return { kind: "state" as const, data };
    }
    if (selection.view === "metro") {
      const summ = msaSummaryByCbsa.get(selection.id);
      const path = msaPathByCbsa.get(selection.id);
      const xinfo = cbsaInfo.get(selection.id);
      if (!summ && !path) return null;
      const detail = msaOccByCbsa.get(selection.id);
      const data: MsaSidebarData = {
        cbsa: selection.id,
        title: summ?.title ?? path?.name ?? selection.id,
        primState: summ?.primState ?? path?.primState ?? "",
        type: summ?.type ?? path?.type,
        totalEmployment: summ?.totalEmployment ?? 0,
        weightedNetRisk100: summ?.weightedNetRisk100Full ?? summ?.weightedNetRisk100 ?? 0,
        occupationCount: summ?.occupationCount ?? 0,
        topOccupations: detail?.topOccupations,
        members: xinfo?.counties ?? (path?.counties.map((fips) => ({
          fips,
          name: countyRiskByFips.get(fips)?.name ?? fips,
          role: "—",
        })) ?? []),
      };
      return { kind: "msa" as const, data, loading: msaOccLoading && !detail };
    }
    // county
    const c = countyRiskByFips.get(selection.id);
    if (!c) return null;
    const detail = countyOccByFips.get(selection.id);
    const data: CountySidebarData = {
      fips: c.fips,
      name: c.name,
      stateFips: c.stateFips,
      totalEmployment: c.totalEmployment,
      weightedNetRisk100: c.weightedNetRisk100,
      occupationGroups: detail?.occupationGroups,
      topGroupsFallback: c.topGroups,
    };
    return { kind: "county" as const, data, loading: countyOccLoading && !detail };
  }, [
    selection,
    stateByFips,
    msaSummary,
    msaSummaryByCbsa,
    msaPathByCbsa,
    cbsaInfo,
    msaOccByCbsa,
    msaOccLoading,
    countyRiskByFips,
    countyOccByFips,
    countyOccLoading,
    stateRisk,
    occupations,
  ]);

  /* Labels: only show state abbreviations in country view (else map gets crowded) */
  const labels = useCallback(
    (f: GeoFeature) => {
      if (view !== "country") return null;
      const w = f.bbox[2] - f.bbox[0];
      const h = f.bbox[3] - f.bbox[1];
      if (w < 40 || h < 25) return null;
      const s = stateByFips.get(f.id);
      if (!s) return null;
      return (
        <text
          key={`label-${f.id}`}
          x={f.centroid[0]}
          y={f.centroid[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: 10,
            fontFamily: "'DM Mono', monospace",
            fill: "#111",
            fillOpacity: 0.7,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {s.abbr}
        </text>
      );
    },
    [view, stateByFips],
  );

  /* Breadcrumb */
  const breadcrumb = useMemo(() => {
    const parts: string[] = ["US"];
    if (selection.view === "country" && selection.id) {
      parts.push(stateByFips.get(selection.id)?.title ?? selection.id);
    } else if (selection.view === "metro" && selection.id) {
      const summ = msaSummaryByCbsa.get(selection.id);
      const path = msaPathByCbsa.get(selection.id);
      const primState = summ?.primState ?? path?.primState ?? null;
      if (primState) {
        const st = stateRisk.states.find((s) => s.abbr === primState);
        if (st) parts.push(st.title);
      }
      parts.push(summ?.title ?? path?.name ?? selection.id);
    } else if (selection.view === "county" && selection.id) {
      const c = countyRiskByFips.get(selection.id);
      if (c) {
        const st = stateRisk.states.find((s) => s.fips === c.stateFips);
        if (st) parts.push(st.title);
        parts.push(c.name);
      }
    }
    return parts;
  }, [selection, stateByFips, msaSummaryByCbsa, msaPathByCbsa, countyRiskByFips, stateRisk]);

  /* Metric toggle is only meaningful in country view */
  const metricToggleEnabled = view === "country";

  /* Hover tooltip data */
  const tooltipData = useMemo(() => {
    if (!hoverId || !tooltip) return null;
    const v = layer.valueOf(hoverId);
    return {
      name: layer.nameOf(hoverId),
      value: v,
      employment: layer.employmentOf(hoverId),
      x: tooltip.x,
      y: tooltip.y,
    };
  }, [hoverId, tooltip, layer]);

  /* Color scale range for legend */
  const legendRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const f of layer.features) {
      const v = layer.valueOf(f.id);
      if (v == null || !Number.isFinite(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { min: 0, max: 100 };
    }
    return { min, max };
  }, [layer]);

  return (
    <section className="mt-16 sm:mt-20">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
          Section 03 &middot; Regional explorer
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-heading leading-tight">
          Where the risk lands on the map
        </h2>
        <p className="text-base text-[var(--muted)] leading-relaxed mt-2 max-w-[680px]">
          One map, three lenses. Switch between state, metro, and county view; click any
          polygon to see the occupations driving its score and drill down to the labor-market
          detail.
        </p>
      </div>

      <div className="border border-card rounded-lg overflow-hidden bg-white">
        {/* Top bar: search */}
        <div className="px-4 sm:px-5 py-3 border-b border-card">
          <MapSearch results={searchResults} onSelect={onSearchSelect} />
        </div>

        <div className="grid lg:grid-cols-[1fr_320px]">
          {/* Left: map + controls */}
          <div className="border-r border-card">
            {/* Controls strip */}
            <div className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3 border-b border-card">
              {/* Segmented view toggle */}
              <div
                role="group"
                aria-label="Map view mode"
                className="inline-flex border border-card rounded-md overflow-hidden text-2xs"
              >
                {(["country", "metro", "county"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 capitalize transition-colors ${
                      view === v
                        ? "bg-[var(--accent)] text-white"
                        : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                    }`}
                    aria-pressed={view === v}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Metric toggle */}
              <div
                role="group"
                aria-label="Metric"
                className="inline-flex border border-card rounded-md overflow-hidden text-2xs"
              >
                <button
                  onClick={() => setMetric("netRisk")}
                  className={`px-3 py-1.5 transition-colors ${
                    metric === "netRisk"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                  }`}
                >
                  Net risk
                </button>
                <button
                  onClick={() => metricToggleEnabled && setMetric("pctHigh")}
                  disabled={!metricToggleEnabled}
                  title={metricToggleEnabled ? undefined : "Available in Country view only"}
                  className={`px-3 py-1.5 transition-colors ${
                    metric === "pctHigh" && metricToggleEnabled
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                  } ${!metricToggleEnabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  % high-risk time
                </button>
              </div>

              {/* Scale toggle */}
              <div
                role="group"
                aria-label="Color scale"
                className="inline-flex border border-card rounded-md overflow-hidden text-2xs"
                title="Quintile bins regions into 5 equally-sized groups by rank — clear contrast without overstating magnitude. Stretched fills the gradient across observed min-max. Absolute uses a fixed 0-100 scale."
              >
                <button
                  onClick={() => setScaleMode("quantile")}
                  className={`px-3 py-1.5 transition-colors ${
                    scaleMode === "quantile"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                  }`}
                >
                  Quintile
                </button>
                <button
                  onClick={() => setScaleMode("stretched")}
                  className={`px-3 py-1.5 transition-colors ${
                    scaleMode === "stretched"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                  }`}
                >
                  Stretched
                </button>
                <button
                  onClick={() => setScaleMode("absolute")}
                  className={`px-3 py-1.5 transition-colors ${
                    scaleMode === "absolute"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                  }`}
                >
                  Absolute
                </button>
              </div>

              <div className="ml-auto flex items-center gap-3">
                {selection.id && (
                  <button
                    onClick={reset}
                    className="text-2xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Reset view
                  </button>
                )}
              </div>
            </div>

            {/* Map */}
            <div
              ref={containerRef}
              className="relative bg-[#FAFAFA] overflow-hidden"
              onClick={(e) => {
                // Background click resets only when the SVG is clicked directly.
                const tgt = e.target as SVGElement | HTMLElement;
                if (tgt.tagName.toLowerCase() === "svg" || tgt.tagName.toLowerCase() === "g") {
                  setSelection((cur) => ({ ...cur, id: null }));
                }
              }}
            >
              <MapCanvas
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                features={layer.features}
                backgroundFeatures={layer.background}
                colorBy={colorBy}
                selectedId={selection.id}
                hoverId={hoverId}
                onSelect={(id) => {
                  setSelection({ view, id });
                }}
                onHover={onHover}
                transform={transform}
                labels={labels}
                ariaLabel={
                  view === "country"
                    ? "US states colored by AI risk"
                    : view === "metro"
                    ? "US metros colored by AI risk"
                    : "US counties colored by AI risk"
                }
              />

              {/* Tooltip */}
              {tooltipData && (
                <div
                  className="pointer-events-none absolute z-20 px-2.5 py-1.5 bg-white border border-strong rounded-md shadow-md text-2xs leading-tight"
                  style={{
                    left: Math.min(tooltipData.x + 14, (containerRef.current?.clientWidth ?? 0) - 180),
                    top: Math.max(0, tooltipData.y - 12),
                  }}
                >
                  <div className="font-semibold text-[var(--foreground)]">{tooltipData.name}</div>
                  <div className="text-[var(--muted)] font-mono">
                    {tooltipData.value != null ? (
                      <>
                        Risk {tooltipData.value.toFixed(metric === "pctHigh" && view === "country" ? 1 : 0)}
                        {metric === "pctHigh" && view === "country" ? "%" : "/100"}
                        {tooltipData.employment > 0 && (
                          <> · {formatJobs(tooltipData.employment)}</>
                        )}
                      </>
                    ) : (
                      "no data"
                    )}
                  </div>
                </div>
              )}

              {/* Legend overlay */}
              <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur border border-card rounded-md px-3 py-2 text-2xs leading-tight pointer-events-none max-w-[280px]">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 flex items-baseline justify-between gap-2">
                  <span>
                    {view === "country" && metric === "pctHigh"
                      ? "% high-risk task time"
                      : "Net risk (0–100)"}
                  </span>
                  <span className="font-mono normal-case tracking-normal opacity-60">
                    {scaleMode}
                  </span>
                </div>
                {scaleMode === "quantile" ? (
                  <>
                    <div className="flex h-2 w-32 rounded-sm overflow-hidden">
                      {["#16A34A", "#84CC16", "#FBBF24", "#F59E0B", "#DC2626"].map((c) => (
                        <div key={c} className="flex-1" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[var(--muted)] font-mono mt-0.5" style={{ width: "8rem" }}>
                      <span>Q1</span>
                      <span>Q5</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--muted)] font-mono">
                      {scaleMode === "stretched" ? legendRange.min.toFixed(view === "country" && metric === "pctHigh" ? 1 : 0) : "0"}
                    </span>
                    <div
                      className="h-2 w-28 rounded-sm"
                      style={{
                        background: "linear-gradient(to right, #16A34A, #FBBF24, #F59E0B, #DC2626)",
                      }}
                    />
                    <span className="text-[var(--muted)] font-mono">
                      {scaleMode === "stretched" ? legendRange.max.toFixed(view === "country" && metric === "pctHigh" ? 1 : 0) : "100"}
                    </span>
                  </div>
                )}
                <div className="mt-1.5 text-[10px] text-[var(--muted)] leading-snug">
                  Range:{" "}
                  <span className="font-mono">
                    {legendRange.min.toFixed(view === "country" && metric === "pctHigh" ? 1 : 0)}–
                    {legendRange.max.toFixed(view === "country" && metric === "pctHigh" ? 1 : 0)}
                  </span>
                  {scaleMode === "quantile" && (
                    <span className="opacity-70"> · binned by rank</span>
                  )}
                  {scaleMode === "absolute" && legendRange.max - legendRange.min < 8 && (
                    <span className="opacity-70">. Try Quintile/Stretched.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 sm:px-5 py-2.5 border-t border-card flex items-center text-2xs text-[var(--muted)]">
              {breadcrumb.map((b, i) => (
                <span key={i} className="inline-flex items-center">
                  {i > 0 && <span className="mx-1.5 opacity-50">›</span>}
                  <span className={i === breadcrumb.length - 1 ? "text-[var(--foreground)] font-medium" : ""}>
                    {b}
                  </span>
                </span>
              ))}
              {view === "county" && !countyPaths && (
                <span className="ml-auto text-[var(--muted)] opacity-70">Loading county geometry…</span>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="p-5 min-h-[420px]">
            {sidebar && sidebar.kind === "default" && (
              <ExplorerSidebar kind="default" national={sidebar.national} />
            )}
            {sidebar && sidebar.kind === "state" && (
              <ExplorerSidebar
                kind="state"
                data={sidebar.data}
                onFocusMsa={focusMsa}
              />
            )}
            {sidebar && sidebar.kind === "msa" && (
              <ExplorerSidebar
                kind="msa"
                data={sidebar.data}
                onFocusCounty={focusCounty}
                loading={sidebar.loading}
              />
            )}
            {sidebar && sidebar.kind === "county" && (
              <ExplorerSidebar
                kind="county"
                data={sidebar.data}
                loading={sidebar.loading}
              />
            )}
          </div>
        </div>

        {/* Caveat strip */}
        <div className="border-t border-card px-4 sm:px-5 py-2.5 text-2xs text-[var(--muted)] bg-[#FAFAFA]">
          State and metro scores: BLS OEWS May 2024 (~325 SOC codes per area). County scores:
          Census ACS 2019–2023 at SOC major-group granularity. Color is stretched across the
          observed min–max so contrast pops.
        </div>
      </div>
    </section>
  );
}

export type { Props as RegionalExplorerProps };
export type ViewModeT = ViewMode;
