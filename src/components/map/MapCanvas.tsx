"use client";

import { memo, useMemo } from "react";

export interface GeoFeature {
  id: string;
  name: string;
  d: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

interface Props {
  width: number;
  height: number;
  features: GeoFeature[];
  /** Optional second layer drawn underneath, faded — e.g. all counties under MSA overlay. */
  backgroundFeatures?: GeoFeature[];
  colorBy: (id: string) => string;
  selectedId?: string | null;
  hoverId?: string | null;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null, evt: React.MouseEvent | null) => void;
  /** Optional CSS transform on the inner <g>. */
  transform?: string;
  /** Optional label renderer (e.g. state abbreviations). */
  labels?: (feature: GeoFeature) => React.ReactNode | null;
  /** ARIA label for the svg. */
  ariaLabel?: string;
}

function MapCanvasImpl({
  width,
  height,
  features,
  backgroundFeatures,
  colorBy,
  selectedId,
  hoverId,
  onSelect,
  onHover,
  transform,
  labels,
  ariaLabel,
}: Props) {
  // Precompute selected feature so its path renders on top with a strong outline.
  const { rest, selected } = useMemo(() => {
    if (!selectedId) return { rest: features, selected: null };
    let sel: GeoFeature | null = null;
    const rest: GeoFeature[] = [];
    for (const f of features) {
      if (f.id === selectedId) sel = f;
      else rest.push(f);
    }
    return { rest, selected: sel };
  }, [features, selectedId]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto block"
      role="img"
      aria-label={ariaLabel}
      onMouseLeave={(evt) => onHover?.(null, evt)}
    >
      <g
        style={{
          transform: transform ?? "none",
          transformOrigin: "0 0",
          transition: "transform 450ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Background layer — rural counties under MSA, etc. */}
        {backgroundFeatures && (
          <g aria-hidden="true">
            {backgroundFeatures.map((f) => (
              <path
                key={`bg-${f.id}`}
                d={f.d}
                fill="#EEEEEC"
                stroke="#fff"
                strokeWidth={0.3}
                style={{ pointerEvents: "none" }}
              />
            ))}
          </g>
        )}

        {/* Foreground polygons */}
        {rest.map((f) => {
          const isHover = hoverId === f.id;
          return (
            <path
              key={f.id}
              d={f.d}
              fill={colorBy(f.id)}
              stroke={isHover ? "#111" : "#fff"}
              strokeWidth={isHover ? 0.9 : 0.4}
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer"
              style={{ transition: "stroke 120ms" }}
              onMouseEnter={(evt) => onHover?.(f.id, evt)}
              onMouseMove={(evt) => onHover?.(f.id, evt)}
              onClick={() => onSelect?.(f.id)}
              aria-label={f.name}
            />
          );
        })}
        {selected && (
          <path
            key={selected.id}
            d={selected.d}
            fill={colorBy(selected.id)}
            stroke="#111"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
            className="cursor-pointer"
            onMouseEnter={(evt) => onHover?.(selected.id, evt)}
            onMouseMove={(evt) => onHover?.(selected.id, evt)}
            onClick={() => onSelect?.(selected.id)}
            aria-label={selected.name}
          />
        )}

        {/* Labels (e.g. state abbreviations) */}
        {labels && (
          <g aria-hidden="true">
            {features.map((f) => labels(f))}
          </g>
        )}
      </g>
    </svg>
  );
}

const MapCanvas = memo(MapCanvasImpl);
export default MapCanvas;
