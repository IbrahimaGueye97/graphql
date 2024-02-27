// Paramètres du diagramme
export const diameter = 250;
export const radius = diameter / 2;
export const numDataPoints = 15;
export const svg2 = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
svg2.setAttribute("width", diameter);
svg2.setAttribute("height", diameter);

// Fonction pour dessiner le diagramme radar
export const DrawRadarChart = (data, cx, cy, radius) => {
  // Calcul des angles et de la valeur maximale
  const angles = calculateAngles(data.length);
  const maxValue = Math.max(...data.map((item) => item.amount));

  // Dessin des lignes radiales
  drawRadialLines(cx, cy, radius, angles);

  // Dessin des segments
  const pathData = generatePathData(data, maxValue, angles, cx, cy);
  drawPath(pathData, "rgb(69, 210, 201)");

  // Ajout des zones de survol
  addHoverAreas(data, angles, cx, cy, handleMouseOver, handleMouseOut, maxValue);
};

// Fonction pour calculer les angles
function calculateAngles(numDataPoints) {
  const angles = [];
  for (let i = 0; i < numDataPoints; i++) {
    const angle = (Math.PI * 2 * i) / numDataPoints;
    angles.push(angle);
  }
  return angles;
}

// Fonction pour dessiner les lignes radiales
function drawRadialLines(cx, cy, radius, angles) {
  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${cx},${cy} L ${x},${y}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "white");
    svg2.appendChild(path);
  }
}

// Fonction pour générer le chemin des segments
function generatePathData(data, maxValue, angles, cx, cy) {
  let d = "";
  for (let i = 0; i < data.length; i++) {
    const angle = angles[i];
    const value = data[i].amount;
    const normalizedValue = value / maxValue;
    const x = cx + radius * normalizedValue * Math.cos(angle);
    const y = cy + radius * normalizedValue * Math.sin(angle);
    if (i === 0) {
      d += `M ${x},${y} `;
    } else {
      d += `L ${x},${y} `;
    }
  }
  d += "Z"; // Fermer le chemin
  return d;
}

// Fonction pour dessiner le chemin
function drawPath(d, fill) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", fill);
  svg2.appendChild(path);
}

// Fonction pour ajouter les zones de survol
// Fonction pour ajouter les zones de survol directement sur les barres du diagramme
function addHoverAreas(data, angles, cx, cy, handleMouseOver, handleMouseOut, maxValue) {
  data.forEach((item, index) => {
    const angle = angles[index];
    const value = item.amount;
    const normalizedValue = value / maxValue;
    const x = cx + radius * normalizedValue * Math.cos(angle);
    const y = cy + radius * normalizedValue * Math.sin(angle);
    const prevIndex = (index === 0) ? data.length - 1 : index - 1;
    const prevValue = data[prevIndex].amount;
    const prevNormalizedValue = prevValue / maxValue;
    const prevX = cx + radius * prevNormalizedValue * Math.cos(angles[prevIndex]);
    const prevY = cy + radius * prevNormalizedValue * Math.sin(angles[prevIndex]);

    // Créer et ajouter l'élément path représentant la barre du diagramme
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${prevX},${prevY} L ${x},${y}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "transparent"); // Rendre la barre invisible, mais toujours détectable
    path.setAttribute("stroke-width", "20"); // Ajuster la largeur pour faciliter le survol
    path.setAttribute("data-type", item.type); // Définir l'attribut data-type avec le type correspondant
    path.addEventListener("mouseover", handleMouseOver);
    path.addEventListener("mouseout", handleMouseOut);
    svg2.appendChild(path);
  });
}




// Fonction pour gérer le survol de la souris
const handleMouseOver = (event) => {
  const type = event.target.getAttribute("data-type"); // Récupérer le type depuis l'attribut data-type
  // Afficher le type ou effectuer d'autres actions
  document.querySelector("#hoverInfo").innerHTML = type
  document.querySelector("#hoverInfo").style.display = "block"
  console.log("Type:", type);
  // Vous pouvez également ajouter du code pour afficher le type dans une info-bulle ou une autre zone de votre choix
};

// Fonction pour gérer le départ du survol de la souris
const handleMouseOut = (event) => {
  // Effacer ou masquer les informations affichées lors du survol
  // Vous pouvez ajouter d'autres actions si nécessaire
  document.querySelector("#hoverInfo").style.display = "none";
};

