// Paramètres du diagramme
const diameter = 220;
export const radius2 = diameter / 2;
export const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", diameter);
svg.setAttribute("height", diameter);


// Fonction pour dessiner le diagramme circulaire
export const DrawPieChart = (data, cx, cy, radius) => {
    let total = 0;
    data.forEach(item => total += item.count);
    let startAngle = 0;
    data.forEach(item => {
        const angle = (item.count / total) * 2 * Math.PI;
        const segment = drawSegment(cx, cy, radius, startAngle, startAngle + angle, getRandomColor());
        // Vérifiez si item.label et item.count sont définis et ont des valeurs valides avant de concaténer
        const label = item.label || "";
        const count = item.count !== undefined ? item.count : "";
        segment.setAttribute("data-info", `${label}-${count}`); // Stocker les données avec un séparateur
        segment.addEventListener("mouseover", handleMouseOver);
        segment.addEventListener("mouseout", handleMouseOut);
        startAngle += angle;
    });
};

// Fonction pour dessiner un segment
const drawSegment = (x, y, radius, startAngle, endAngle, color) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const startX = x + radius2 * Math.cos(startAngle);
    const startY = y + radius2 * Math.sin(startAngle);
    const endX = x + radius2 * Math.cos(endAngle);
    const endY = y + radius2 * Math.sin(endAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    const d = `M ${x},${y} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
    path.setAttribute("d", d);
    path.setAttribute("fill", color);
    svg.appendChild(path);
    return path; // Retourner le chemin créé
};

// Fonction pour gérer le survol de la souris
const handleMouseOver = (event) => {
    const [label, count] = event.target.getAttribute("data-info").split("-"); // Séparer les données avec le séparateur
    // Afficher les données en survol dans une zone dédiée de votre page HTML
    document.getElementById("hoverInfoCircul").innerText = label + ": " + count;
    document.getElementById("hoverInfoCircul").style.display = "block";
};


// Fonction pour gérer le départ du survol de la souris
const handleMouseOut = () => {
    // Masquer les informations en survol lorsque la souris quitte le segment
    document.getElementById("hoverInfoCircul").style.display = "none";
};

// Fonction pour générer une couleur aléatoire
const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
