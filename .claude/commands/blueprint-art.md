# Blueprint Art

Generate beautiful, minimalist, three-dimensional blueprint-style SVG renderings. You are an expert technical illustrator specializing in isometric architectural and mechanical drawings with a futuristic aesthetic.

## Input

Subject: $ARGUMENTS
- If blank: generate a futuristic industrial scene (factory floor, server farm, robotic assembly line)
- If a word or phrase: interpret as the subject and compose an isometric blueprint scene around it
- Examples: "city", "data center", "robot arm", "space station", "quantum computer"

## Output Location

Save the SVG to: `public/images/blueprints/{slug}.svg` where `{slug}` is a kebab-case version of the subject.

## Core Aesthetic

The style is **technical blueprint** — the visual language of engineering drawings, patent illustrations, and architectural plans, but with a futuristic, sci-fi sensibility.

### Visual DNA
- **Palette**: Monochrome blue line work on white/near-white background
  - Primary lines: `#1a3a5c` (dark steel blue)
  - Secondary lines: `#3d6b99` (medium blueprint blue)
  - Fine detail lines: `#7ba3cc` (light blueprint blue)
  - Accent/glow lines: `#a8d4ff` (pale highlight blue)
  - Background: `#f8fbff` (barely-blue white)
  - Grid lines: `#e8f0f8` (faint blue-gray)
- **Line weights**: Three distinct weights create depth hierarchy
  - Heavy outlines: `stroke-width="1.5"` — primary structural edges
  - Medium lines: `stroke-width="0.8"` — secondary structure, panels, seams
  - Fine lines: `stroke-width="0.3"` — hatching, dimensions, annotations, grid
- **No fills**: Shapes are defined by their edges only. Use cross-hatching or parallel-line shading for depth, never solid fills (except very subtle background)
- **Isometric projection**: 30-degree iso grid. No vanishing-point perspective. All parallel lines stay parallel

### Composition Principles
1. **Density gradient**: Dense mechanical detail in the center, fading to sparse construction lines at edges
2. **Layered depth**: At least 3 distinct depth planes — foreground structure, mid-ground machinery, background grid/framework
3. **Exploded views**: Some components slightly separated from their housing, showing internal structure
4. **Dimension lines**: Include a few technical dimension annotations (lines with arrows and numbers) for authenticity
5. **Cross-hatching**: Use angled parallel lines (45-degree or 30-degree) to indicate cut surfaces or shadow
6. **Construction lines**: Let some faint guide lines extend beyond the main subject, as if the drawing is in-progress
7. **Circular elements**: Gears, dials, ports, pipes — circles and arcs break up the rectilinear grid
8. **Asymmetric balance**: Not symmetrical, but visually balanced. Heavy detail on one side, open space on the other

### Isometric Grid Rules
- X-axis: 30 degrees from horizontal (right)
- Y-axis: 30 degrees from horizontal (left)
- Z-axis: vertical
- Use `transform` attributes for isometric positioning
- Helper: for iso coordinates (x, y, z) → SVG position: `svgX = centerX + (x - y) * cos(30)`, `svgY = centerY - z + (x + y) * sin(30)`

## SVG Construction Guidelines

### Structure
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <!-- Reusable patterns: hatching, grid -->
  </defs>
  <g id="background"><!-- Grid, construction lines --></g>
  <g id="layer-back"><!-- Background structures --></g>
  <g id="layer-mid"><!-- Main subject --></g>
  <g id="layer-front"><!-- Foreground details --></g>
  <g id="annotations"><!-- Dimension lines, labels --></g>
</svg>
```

### Required Patterns (define in `<defs>`)
```xml
<!-- Cross-hatch pattern for cut surfaces -->
<pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8">
  <path d="M0,8 L8,0" stroke="#7ba3cc" stroke-width="0.3" />
</pattern>

<!-- Isometric grid -->
<pattern id="iso-grid" patternUnits="userSpaceOnUse" width="40" height="46.2">
  <path d="M0,23.1 L20,0 L40,23.1 M0,23.1 L20,46.2 L40,23.1"
        stroke="#e8f0f8" stroke-width="0.3" fill="none" />
</pattern>
```

### Technical Detail Elements (use liberally)
- **Bolt heads**: Small hexagons at structural joints
- **Pipe connections**: Circles with internal cross lines
- **Panel seams**: Dashed lines along flat surfaces
- **Vents/grilles**: Parallel line groups
- **Rivets**: Tiny circles along edges
- **Wire bundles**: Grouped curved paths
- **Readout screens**: Rectangles with horizontal scan lines
- **Brackets/flanges**: L-shaped or T-shaped connector details

### Dimension Annotations
Add 3-5 dimension annotations using this pattern:
```xml
<g class="dimension" stroke="#7ba3cc" stroke-width="0.3">
  <line x1="100" y1="400" x2="100" y2="350" /> <!-- extension line -->
  <line x1="300" y1="400" x2="300" y2="350" /> <!-- extension line -->
  <line x1="100" y1="360" x2="300" y2="360" /> <!-- dimension line -->
  <!-- arrowheads -->
  <polygon points="100,360 106,358 106,362" fill="#7ba3cc" />
  <polygon points="300,360 294,358 294,362" fill="#7ba3cc" />
  <text x="200" y="355" text-anchor="middle"
        font-family="'Courier New', monospace" font-size="8" fill="#7ba3cc">
    2400mm
  </text>
</g>
```

### Text Styling
All text must use monospace fonts for the technical aesthetic:
```
font-family="'Courier New', monospace"
font-size="8" (annotations) or "10" (labels)
fill="#3d6b99"
```

## Complexity Targets

Aim for genuine visual complexity — these are meant to be visually striking:
- **Minimum 200 path/line elements** in the final SVG
- **At least 15 distinct mechanical/architectural components** (not just repeated shapes)
- **3+ circular/curved elements** (gears, pipes, dials)
- **Cross-hatching on at least 3 surfaces**
- **5+ bolt/rivet details**
- **Construction lines extending past the subject bounds**
- The SVG should feel like it was drawn by a skilled drafter, not generated by a simple algorithm

## Process

1. **Conceive the scene**: Based on the subject, imagine a specific isometric composition. What's the hero structure? What surrounds it? What's in the foreground vs background?
2. **Lay the grid**: Start with the isometric background grid and faint construction lines
3. **Build the main structure**: Heavy outlines first, then medium structural lines
4. **Add mechanical detail**: Bolts, pipes, vents, panels, seams — the texture that makes it feel real
5. **Apply hatching**: Cross-hatch cut surfaces and shadow areas
6. **Annotate**: Add dimension lines and technical labels
7. **Verify**: Ensure no solid fills (except background rect and tiny accent fills on arrowheads/bolts), all shapes are line-defined, isometric angles are consistent

## Quality Checklist

Before saving, verify:
- [ ] SVG is valid and renders correctly
- [ ] No solid color fills on major shapes (line work only)
- [ ] At least 3 distinct line weights used
- [ ] Isometric angles consistent (30-degree grid)
- [ ] Blue monochrome palette only — no other colors
- [ ] Cross-hatching present on cut/shadow surfaces
- [ ] Dimension annotations included
- [ ] Dense enough to be visually impressive at full size
- [ ] Background grid visible but subtle
- [ ] File saved to `public/images/blueprints/` directory

## Example Subjects & Composition Ideas

| Subject | Hero Structure | Supporting Elements |
|---------|---------------|-------------------|
| "factory" | Robotic arm assembly cell | Conveyor belts, control panels, overhead gantry |
| "data center" | Server rack cluster (iso cutaway) | Cable trays, cooling pipes, floor tiles |
| "engine" | Turbine cross-section | Intake manifold, exhaust system, mounting frame |
| "city" | Tiered building complex | Skyways, transit tubes, antenna arrays |
| "laboratory" | Centrifuge/reactor vessel | Instrument panels, pipe manifolds, fume hoods |
| "spacecraft" | Modular station segment | Docking ports, solar array mechanisms, airlocks |

Always create something that would look stunning printed as a large-format blueprint poster.
