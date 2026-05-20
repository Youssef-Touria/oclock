//Horloge 
const horloge = document.getElementById("clock");
function afficherHeure() {
    const date = new Date();
    const heures =String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const secondes = String(date.getSeconds()).padStart(2, "0");
    horloge.textContent = heures + ":" + minutes + ":" + secondes;
}
afficherHeure();
setInterval(afficherHeure, 1000);

// CHRONOMETRE
const affichageChrono= document.getElementById("affichage-chrono");
const boutonChrono = document.getElementById("bouton-chrono");
const boutonReset = document.getElementById("bouton-reset");
const boutonTour = document.getElementById("bouton-tour");
const listeTours = document.getElementById("liste-tours");
let secondesEcoulees = 0;
let chronoTimer = null;

    function tickChrono() {
    secondesEcoulees++;
   
    const h = Math.floor(secondesEcoulees / 3600);
    const m = Math.floor((secondesEcoulees % 3600) / 60);
    const s = secondesEcoulees % 60;
    affichageChrono.textContent = 
        String(h).padStart(2, "0") + ":" + 
        String(m).padStart(2, "0") + ":" + 
        String(s).padStart(2, "0");

}
boutonChrono.addEventListener("click", function() {
    if (boutonChrono.textContent === "Marche") {
        boutonChrono.textContent = "Arrêt";
        chronoTimer = setInterval(tickChrono, 1000);
    } else {
        boutonChrono.textContent = "Marche";
        clearInterval(chronoTimer);
    }
});
boutonReset.addEventListener("click", function() {
    clearInterval(chronoTimer);
    secondesEcoulees = 0;
    affichageChrono.textContent = "00:00:00";
    boutonChrono.textContent = "Marche";
    listeTours.innerHTML = "";
});
boutonTour.addEventListener("click", function() {
    if (secondesEcoulees > 0) {
        const tempsActuel = affichageChrono.textContent;
        const li = document.createElement("li");
        li.textContent = "Tour : " + tempsActuel;
        listeTours.appendChild(li);
    }
});

// MINUTEUR
const affichageMinuteur = document.getElementById("affichage-minuteur");
const inputMinutes = document.getElementById("input-minutes");
const inputSecondes = document.getElementById("input-secondes");
const boutonMinuteur = document.getElementById("bouton-minuteur");
let totalSecondes = 0;
let minuteurTimer = null;
function tickMinuteur() {
    if (totalSecondes <= 0) {
        clearInterval(minuteurTimer);
        minuteurTimer = null;
        boutonMinuteur.textContent = "Démarrer";
        alert("Le temps est écoulé ! ");
        return;
    }
    totalSecondes--;
    const m = Math.floor(totalSecondes / 60);
    const s = totalSecondes % 60;
    affichageMinuteur.textContent = 
        String(m).padStart(2, "0") + ":" + 
        String(s).padStart(2, "0");
}

boutonMinuteur.addEventListener("click", function() {
    if (minuteurTimer) {
        clearInterval(minuteurTimer);
        minuteurTimer = null;
        boutonMinuteur.textContent = "Démarrer";
    } else {
        const minutes = parseInt(inputMinutes.value) || 0;
        const secondes = parseInt(inputSecondes.value) || 0;
        totalSecondes = minutes * 60 + secondes;
        minuteurTimer = setInterval(tickMinuteur, 1000);
        boutonMinuteur.textContent = "Arrêt";
    }
});
// RÉVEIL
const inputHeureAlarme = document.getElementById("input-heure-alarme");
const inputMessageAlarme = document.getElementById("input-message-alarme");
const boutonAjouterAlarme = document.getElementById("bouton-ajouter-alarme");
const listeAlarmes = document.getElementById("liste-alarmes");
const zoneAlertes = document.getElementById("zone-alertes");
let alarmes = [];

boutonAjouterAlarme.addEventListener("click", function() {
    if (!inputHeureAlarme.value || !inputMessageAlarme.value) return;
    
    alarmes.push({
        heure: inputHeureAlarme.value,
        message: inputMessageAlarme.value,
        sonnee: false
    });
    
    inputMessageAlarme.value = "";
});
function verifierAlarmes() {
    listeAlarmes.innerHTML = "";
    const maintenant = new Date();

    alarmes.forEach(function(alarme) {
        const li = document.createElement("li");
        const [h, m] = alarme.heure.split(":");
        const cible = new Date();
        cible.setHours(h, m, 0, 0);

        if (maintenant > cible) {
            li.textContent = alarme.heure + " - " + alarme.message + " (passée)";
            if (!alarme.sonnee) {
                const div = document.createElement("div");
                div.textContent = "🚨 ALERTE : " + alarme.message;
                div.style.color = "red";
                zoneAlertes.appendChild(div);
                alarme.sonnee = true;
            }
        } else {
            const diffMinutes = Math.ceil((cible - maintenant) / 60000);
            li.textContent = alarme.heure + " - " + alarme.message + " (dans " + diffMinutes + " min)";
        }
        listeAlarmes.appendChild(li);
    });
}
verifierAlarmes();
setInterval(verifierAlarmes, 1000);

