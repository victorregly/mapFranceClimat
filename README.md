## Quick Start
Clone the repo and serve locally:
```bash
git clone https://github.com/victorregly/mapFranceClimat.git && cd mapFranceClimat
# Mac / Linux
python3 -m http.server 8000
# Windows
python -m http.server 8000


# mapFranceClimat

`mapFranceClimat` is a JavaScript-based 3D web mapping module designed to visualize **municipality-level climate risk exposure across France**.
It renders precomputed climate risk indicators as **interactive 3D extrusions** using GeoJSON data and Mapbox GL JS.

The file is intentionally **visual-only**: all climate indicators, scores, and aggregations are computed upstream (e.g. in R or Python) and ingested here as static spatial data.

---

## Purpose

The goal of `mapFranceClimat` is to:

* Provide an **intuitive 3D representation** of climate risk intensity
* Enable **exploration, comparison, and storytelling** at the municipal scale
* Serve as a **front-end visualization layer** for climate-risk analysis, portfolios, or decision-support tools

Risk intensity is encoded through:

* **Height** (3D extrusion)
* **Color** (continuous or categorical scale)
* **Interactive popups**

---

## Geographic Scope

* Mainland France
* Corsica
* Administrative level: **municipalities (communes)**

---

## Data Requirements

The module expects a **GeoJSON file** with polygon geometries and precomputed attributes.

### Required properties (minimum)

* `risk_score`
  Numeric climate risk score scaled from **0 to 10**

### Optional supported properties

* `nom_commune` — municipality name
* `population` — population count
* `hazard` — climate hazard identifier (e.g. heat, drought, fire, wind, flood)
* `aggregation` — aggregation method used upstream (e.g. sum, PCA, max-dominant)

All numeric values must already be normalized, capped, and validated before loading.

---

## File Structure

project/
├── index.html
├── mapFranceClimat.js
├── data/
│   └── france_climate_risk.geojson
└── styles/

* **mapFranceClimat.js**
  Main JavaScript file responsible for map initialization and rendering

* **france_climate_risk.geojson**
  Static spatial dataset produced by an external processing pipeline

---

## Core Features

* 3D polygon extrusion based on climate risk score
* Continuous color scale mapped to risk intensity
* Fixed camera pitch and bearing for 3D perception
* Mouse hover popups displaying local indicators
* Designed for extension (layer toggles, comparisons, animations)

---

## Technology Stack

* JavaScript (ES6 modules)
* Mapbox GL JS
* GeoJSON

No backend, database, or server-side logic is required.

---

## Design Principles

* **Strict separation of concerns**
  All data processing, indicator construction, and aggregation logic are handled upstream.
  This module focuses exclusively on visualization.

* **Deterministic rendering**
  The map always reflects the content of the input GeoJSON without internal transformations.

* **Scalability**
  Compatible with multiple hazards, aggregation methods, and alternative risk layers.

---

## Typical Use Cases

* Academic research visualization
* Climate risk dashboards
* Consulting or policy support tools
* Portfolio or demonstrator projects
* Interactive storytelling and presentations

---

## Limitations

* No real-time data processing
* No temporal animation unless explicitly added
* Performance depends on GeoJSON size and geometry complexity

---

## License

Usage and redistribution depend on the data sources used to generate the GeoJSON files.
The visualization code itself is framework-agnostic and can be adapted freely.
