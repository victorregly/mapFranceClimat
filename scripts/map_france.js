console.log("map_france.js chargé !");

let currentRiskVar = "agg_sum_norm10";

// 🗺️ Initialiser la carte Mapbox
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [2.2137, 46.2276],
  zoom: 5.3,
  pitch: 45,
  bearing: -10,
  antialias: true
});

// 🧩 Variables de risque
const simpleRisks = [
  { value: "prob_high_danger_score_rounded", label: "High Fire Danger" },
  { value: "prob_extreme_danger_score_rounded", label: "Extreme Fire Danger" },
  { value: "prob_heavy_rain_score_rounded", label: "Heavy Rain" },
  { value: "prob_dry_spell_score_rounded", label: "Dry Spell" },
  { value: "prob_strong_wave_score_rounded", label: "Strong Heatwave" },
  { value: "prob_minor_wave_score_rounded", label: "Minor Heatwave" },
  { value: "prob_tropical_night_wave_score_rounded", label: "Tropical Nights" },
  { value: "prob_beaufort_9_score_rounded", label: "Strong Wind (Bft ≥ 9)" },
  { value: "prob_beaufort_10_score_rounded", label: "Very Strong Wind (Bft ≥ 10)" },
  { value: "p_alea_RGA_Fort_score_rounded", label: "Clay Shrink-Swell (RGA)" },
  { value: "prob_total_terrain_risk_score_rounded", label: "Terrain Movement Risk" },
  { value: "flood_sum_score_rounded", label: "Flood Exposure" }
];

const multiRisks = [
  { value: "agg_sum_norm10", label: "Multi-Risk Score (Sum)" },
  { value: "agg_maxdom_norm10", label: "Multi-Risk Score (Max Dominant)" },
  { value: "agg_pca_norm10", label: "Multi-Risk Score (PCA)" }
];

// 🎨 Ajoute une couche de risque à la carte
function addRiskLayer(varName) {
  currentRiskVar = varName;
  const allRisks = [...simpleRisks, ...multiRisks];
  const riskInfo = allRisks.find(obj => obj.value === varName);
  const riskLabel = riskInfo ? riskInfo.label : varName;

  if (map.getLayer("risk-layer")) map.removeLayer("risk-layer");
  if (map.getSource("communes")) map.removeSource("communes");

  
  // ⬇️ Charger les 15 fichiers en parallèle
  Promise.all([
    fetch("data/communes_risques_part1.geojson").then(r => r.json()),
    fetch("data/communes_risques_part2.geojson").then(r => r.json()),
    fetch("data/communes_risques_part3.geojson").then(r => r.json()),
    fetch("data/communes_risques_part4.geojson").then(r => r.json()),
    fetch("data/communes_risques_part5.geojson").then(r => r.json()),
    fetch("data/communes_risques_part6.geojson").then(r => r.json()),
    fetch("data/communes_risques_part7.geojson").then(r => r.json()),
    fetch("data/communes_risques_part8.geojson").then(r => r.json()),
    fetch("data/communes_risques_part9.geojson").then(r => r.json()),
    fetch("data/communes_risques_part10.geojson").then(r => r.json()),
    fetch("data/communes_risques_part11.geojson").then(r => r.json()),
    fetch("data/communes_risques_part12.geojson").then(r => r.json()),
    fetch("data/communes_risques_part13.geojson").then(r => r.json()),
    fetch("data/communes_risques_part14.geojson").then(r => r.json()),
    fetch("data/communes_risques_part15.geojson").then(r => r.json())
  ])
  .then(([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15]) => {
    const merged = {
      type: "FeatureCollection",
      features: [
        ...p1.features, ...p2.features, ...p3.features, ...p4.features,
        ...p5.features, ...p6.features, ...p7.features, ...p8.features,
        ...p9.features, ...p10.features, ...p11.features, ...p12.features,
        ...p13.features, ...p14.features, ...p15.features
      ]
    };


    map.addSource("communes", {
      type: "geojson",
      data: merged
    });

    map.addLayer({
      id: "risk-layer",
      type: "fill-extrusion",
      source: "communes",
      paint: {
        "fill-extrusion-color": [
          "match",
          ["to-number", ["get", varName]],
          0, "#ffffff",
          1, "#ffffcc",
          2, "#ffeda0",
          3, "#fed976",
          4, "#feb24c",
          5, "#fd8d3c",
          6, "#fc4e2a",
          7, "#e31a1c",
          8, "#bd0026",
          9, "#800026",
          10, "#4d0019",
          "#f0f0f0"
        ],
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["get", "POPULATION"],
          0, 0,
          100000, 50000
        ],
        "fill-extrusion-opacity": 0.9
      }
    });

    console.log("✅ Couche affichée :", riskLabel);
    const titre = document.getElementById("titre-carte");
    if (titre) titre.textContent = riskLabel;
  })
  .catch(err => {
    console.error("❌ Erreur de chargement des fichiers GeoJSON :", err);
  });
}


// ⚙️ Interface utilisateur au chargement de la carte
map.on("load", () => {
  const controlBox = document.createElement("div");
  controlBox.style.position = "absolute";
  controlBox.style.top = "10px";
  controlBox.style.left = "10px";
  controlBox.style.zIndex = "9999";
  controlBox.style.background = "rgba(255,255,255,0.95)";
  controlBox.style.borderRadius = "8px";
  controlBox.style.padding = "10px";
  controlBox.style.boxShadow = "0 0 5px rgba(0,0,0,0.2)";
  controlBox.style.fontFamily = "sans-serif";
  controlBox.style.fontSize = "13px";
  controlBox.style.minWidth = "180px";

  const toggle = document.createElement("div");
  toggle.style.display = "flex";
  toggle.style.marginBottom = "6px";
  toggle.style.border = "1px solid #aaa";
  toggle.style.borderRadius = "4px";
  toggle.style.overflow = "hidden";

  const btnSimple = document.createElement("button");
  btnSimple.textContent = "Simple Risks";
  btnSimple.style.flex = "1";
  btnSimple.style.padding = "6px";
  btnSimple.style.border = "none";
  btnSimple.style.cursor = "pointer";
  btnSimple.style.background = "#f9f9f9";
  btnSimple.style.fontWeight = "bold";

  const btnMulti = document.createElement("button");
  btnMulti.textContent = "Multi-Risks";
  btnMulti.style.flex = "1";
  btnMulti.style.padding = "6px";
  btnMulti.style.border = "none";
  btnMulti.style.cursor = "pointer";
  btnMulti.style.background = "#ddd";
  btnMulti.style.fontWeight = "bold";

  toggle.appendChild(btnSimple);
  toggle.appendChild(btnMulti);
  controlBox.appendChild(toggle);

  const selector = document.createElement("select");
  selector.style.width = "100%";
  selector.style.padding = "5px";
  selector.style.marginTop = "6px";
  selector.style.borderRadius = "4px";
  selector.style.border = "1px solid #ccc";
  selector.style.fontSize = "13px";
  controlBox.appendChild(selector);

  document.body.appendChild(controlBox);

  function populateSelector(options) {
    selector.innerHTML = "";
    options.forEach(obj => {
      const opt = document.createElement("option");
      opt.value = obj.value;
      opt.textContent = obj.label;
      selector.appendChild(opt);
    });
  }

  // 👋 Par défaut, Multi-Risks
  populateSelector(multiRisks);
  addRiskLayer("agg_sum_norm10");
  selector.value = "agg_sum_norm10";
  btnSimple.style.background = "#f9f9f9";
  btnMulti.style.background = "#ddd";

  // 🎯 Actions boutons
  btnSimple.addEventListener("click", () => {
    populateSelector(simpleRisks);
    addRiskLayer(simpleRisks[0].value);
    selector.value = simpleRisks[0].value;
    btnSimple.style.background = "#ddd";
    btnMulti.style.background = "#f9f9f9";
  });

  btnMulti.addEventListener("click", () => {
    populateSelector(multiRisks);
    addRiskLayer(multiRisks[0].value);
    selector.value = multiRisks[0].value;
    btnSimple.style.background = "#f9f9f9";
    btnMulti.style.background = "#ddd";
  });

  selector.addEventListener("change", () => {
    addRiskLayer(selector.value);
  });
});


  map.on("click", "risk-layer", function (e) {
    const props = e.features[0].properties;
    const score = props[currentRiskVar];
    const scoreDisplay = score !== undefined && score !== null ? score : "Indisponible";
  
    const isMulti = multiRisks.some(r => r.value === currentRiskVar);
    const currentMultiLabel = multiRisks.find(r => r.value === currentRiskVar)?.label || "Multi-Risk Score";
  
    let content = `
      <div style="background: rgba(0,0,0,0.85); padding: 10px; border-radius: 5px; color: white;">
        <strong>${props.NOM || "Commune inconnue"}</strong><br>
        👥 Population : ${props.POPULATION ? props.POPULATION.toLocaleString() : "?"}<br>
    `;
  
    if (isMulti) {
      content += `⚠️ <strong>${currentMultiLabel}:</strong> ${scoreDisplay}<br>`;
      content += `<br><strong>📊 Individual Risk Scores:</strong><br>`;
      simpleRisks.forEach(risk => {
        const val = props[risk.value];
        if (val !== undefined && val !== null && val !== "") {
          content += `• ${risk.label}: ${val}<br>`;
        }
      });
    } else {
      content += `⚠️ Score : ${scoreDisplay}<br>`;
    }
  
    content += `</div>`;
  
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(content)
      .addTo(map);
  });
  