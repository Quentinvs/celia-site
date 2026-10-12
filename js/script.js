/* =====================================================
   Script du site pour Célia
   Tout est expliqué en commentaires pour pouvoir le présenter.
   ===================================================== */

/* >>> LES DATES (modifiables ici) <<<
   Attention : en JavaScript, les mois commencent à 0.
   0 = janvier, 5 = juin, 6 = juillet, 2 = mars. */
var DATE_DEBUT = new Date(2026, 6, 12, 0, 0, 0);      // en couple : 12 juillet 2026
var DATE_RENCONTRE = new Date(2026, 5, 14, 0, 0, 0);  // rencontre : 14 juin 2026
var ANNIV_JOUR = 28;                                  // anniversaire : 28 mars 2002
var ANNIV_MOIS = 2;
var ANNIV_ANNEE = 2002;

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var MS_JOUR = 1000 * 60 * 60 * 24;

    /* ---------- Petite fonction pour écrire dans une balise (si elle existe) ---------- */
    function ecrire(id, texte) {
        var element = document.getElementById(id);
        if (element) {
            element.textContent = texte;
        }
    }

    /* ---------- 1. Menu burger sur téléphone ---------- */
    var burger = document.querySelector(".burger");
    var menu = document.querySelector(".menu");
    if (burger && menu) {
        burger.addEventListener("click", function () {
            var ouvert = menu.classList.toggle("ouvert");
            burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
        });
    }

    /* ---------- 2. Compteurs de l'accueil ---------- */
    function majCompteurs() {
        var maintenant = new Date();

        // Temps depuis le début du couple
        var diff = maintenant - DATE_DEBUT;
        if (diff < 0) { diff = 0; }
        var jours = Math.floor(diff / MS_JOUR);
        var heures = Math.floor((diff % MS_JOUR) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var secondes = Math.floor((diff % (1000 * 60)) / 1000);
        ecrire("c-jours", jours);
        ecrire("c-heures", heures);
        ecrire("c-minutes", minutes);
        ecrire("c-secondes", secondes);

        // Mois complets + jours restants
        var mois = (maintenant.getFullYear() - DATE_DEBUT.getFullYear()) * 12 +
                   (maintenant.getMonth() - DATE_DEBUT.getMonth());
        if (maintenant.getDate() < DATE_DEBUT.getDate()) { mois = mois - 1; }
        if (mois < 0) { mois = 0; }
        var repere = new Date(DATE_DEBUT);
        repere.setMonth(DATE_DEBUT.getMonth() + mois);
        var joursEnPlus = Math.floor((maintenant - repere) / MS_JOUR);
        var texteMois = mois + " mois";
        if (joursEnPlus > 0) {
            texteMois += " et " + joursEnPlus + " jour" + (joursEnPlus > 1 ? "s" : "");
        }
        ecrire("c-mois", texteMois);

        // Jours depuis la rencontre
        var joursRencontre = Math.floor((maintenant - DATE_RENCONTRE) / MS_JOUR);
        ecrire("r-jours", joursRencontre);
    }

    /* ---------- 3. Anniversaire de Célia ---------- */
    function majAnniversaire() {
        var maintenant = new Date();
        var aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
        var prochain = new Date(maintenant.getFullYear(), ANNIV_MOIS, ANNIV_JOUR);
        if (prochain < aujourdhui) {
            prochain = new Date(maintenant.getFullYear() + 1, ANNIV_MOIS, ANNIV_JOUR);
        }
        var joursRestants = Math.round((prochain - aujourdhui) / MS_JOUR);
        var ageFutur = prochain.getFullYear() - ANNIV_ANNEE;

        if (joursRestants === 0) {
            ecrire("a-jours", "C'est aujourd'hui !");
            ecrire("a-texte", "Joyeux anniversaire mon amour, tu as " + ageFutur + " ans.");
        } else {
            ecrire("a-jours", joursRestants + " jour" + (joursRestants > 1 ? "s" : ""));
            ecrire("a-texte", "avant tes " + ageFutur + " ans, le 28 mars " + prochain.getFullYear());
        }

        // Âge actuel (pour la fiche d'identité)
        ecrire("age-actuel", (ageFutur - (joursRestants === 0 ? 0 : 1)) + " ans");
    }

    majCompteurs();
    majAnniversaire();
    if (document.getElementById("c-secondes")) {
        setInterval(majCompteurs, 1000);   // le compteur se met à jour chaque seconde
    }

    /* ---------- 4. Pluie de coeurs, de fleurs et de noeuds ---------- */
    var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduit) {
        var pluie = document.createElement("div");
        pluie.className = "pluie";
        pluie.setAttribute("aria-hidden", "true");
        var images = ["images/deco/coeur.svg", "images/deco/fleur.svg", "images/deco/noeud.svg", "images/deco/etoile.svg"];
        var nombre = window.innerWidth < 640 ? 8 : 14;
        for (var i = 0; i < nombre; i++) {
            var morceau = document.createElement("img");
            morceau.src = images[i % images.length];
            morceau.alt = "";
            morceau.className = "chute";
            morceau.style.left = Math.random() * 96 + "%";
            morceau.style.width = 18 + Math.random() * 20 + "px";
            morceau.style.animationDuration = 12 + Math.random() * 12 + "s";
            morceau.style.animationDelay = "-" + Math.random() * 20 + "s";
            pluie.appendChild(morceau);
        }
        document.body.appendChild(pluie);
    }

    /* ---------- 5. Apparition des éléments quand on défile ---------- */
    var aApparaitre = document.querySelectorAll(".apparait");
    if ("IntersectionObserver" in window) {
        var observateur = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (entree) {
                if (entree.isIntersecting) {
                    entree.target.classList.add("visible");
                    observateur.unobserve(entree.target);
                }
            });
        }, { threshold: 0.12 });
        aApparaitre.forEach(function (el) { observateur.observe(el); });
    } else {
        aApparaitre.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- 6. Coeurs qui explosent quand on clique sur un élément "data-coeurs" ---------- */
    document.querySelectorAll("[data-coeurs]").forEach(function (cible) {
        cible.addEventListener("click", function (evenement) {
            if (reduit) { return; }
            for (var k = 0; k < 10; k++) {
                var coeur = document.createElement("img");
                coeur.src = "images/deco/coeur.svg";
                coeur.alt = "";
                coeur.className = "eclat";
                coeur.style.left = evenement.clientX + "px";
                coeur.style.top = evenement.clientY + "px";
                coeur.style.setProperty("--dx", (Math.random() * 200 - 100) + "px");
                coeur.style.setProperty("--dy", (Math.random() * -180 - 20) + "px");
                document.body.appendChild(coeur);
                setTimeout(function (c) { c.remove(); }, 1000, coeur);
            }
        });
    });

    /* ---------- 7. Images Halloween Kitty ----------
       Le site cherche images/kitty/halloween1.png, halloween2.png, etc.
       (il essaie aussi .jpg, .jpeg, .webp et .gif).
       Si une image n'existe pas, son emplacement n'apparaît pas. */
    var ligneKitty = document.querySelector(".kitty-ligne");
    if (ligneKitty) {
        var nombreKitty = parseInt(ligneKitty.getAttribute("data-nombre"), 10) || 4;
        var extensions = ["png", "jpg", "jpeg", "webp", "gif"];

        var creerEmplacement = function (numero) {
            var base = "images/kitty/halloween" + numero + ".";
            var essai = 0;
            var cadre = document.createElement("figure");
            cadre.className = "kitty-slot vide";   // caché tant que l'image n'est pas trouvée
            ligneKitty.appendChild(cadre);

            var image = new Image();
            image.alt = "Image Halloween Kitty";
            image.addEventListener("load", function () {
                cadre.appendChild(image);
                cadre.classList.remove("vide");
            });
            image.addEventListener("error", function () {
                essai = essai + 1;
                if (essai < extensions.length) {
                    image.src = base + extensions[essai];
                }
            });
            image.src = base + extensions[0];
        };

        for (var n = 1; n <= nombreKitty; n++) {
            creerEmplacement(n);
        }
    }

    /* ---------- 8. Galerie : filtres + lightbox ---------- */
    var galerie = document.querySelector(".galerie");
    if (galerie) {
        var items = Array.prototype.slice.call(galerie.querySelectorAll(".item"));
        var boutons = document.querySelectorAll(".filtres button");

        // Filtres
        boutons.forEach(function (bouton) {
            bouton.addEventListener("click", function () {
                var filtre = bouton.getAttribute("data-filtre");
                boutons.forEach(function (b) { b.classList.remove("actif"); });
                bouton.classList.add("actif");
                items.forEach(function (item) {
                    var categories = item.getAttribute("data-cat").split(" ");
                    var garde = (filtre === "tous") || (categories.indexOf(filtre) !== -1);
                    item.classList.toggle("cache", !garde);
                });
            });
        });

        // Lightbox (grande photo au clic)
        var lightbox = document.getElementById("lightbox");
        var grande = document.getElementById("lb-image");
        var legende = document.getElementById("lb-legende");
        var position = 0;

        function visibles() {
            return items.filter(function (item) { return !item.classList.contains("cache"); });
        }

        function afficher(liste) {
            var item = liste[position];
            var img = item.querySelector("img");
            grande.src = img.src;
            grande.alt = img.alt;
            legende.textContent = item.querySelector("figcaption").textContent;
        }

        function ouvrir(item) {
            var liste = visibles();
            position = liste.indexOf(item);
            afficher(liste);
            lightbox.classList.add("ouverte");
            document.getElementById("lb-fermer").focus();
        }

        function fermer() {
            lightbox.classList.remove("ouverte");
        }

        function changer(sens) {
            var liste = visibles();
            position = (position + sens + liste.length) % liste.length;
            afficher(liste);
        }

        items.forEach(function (item) {
            item.setAttribute("tabindex", "0");
            item.addEventListener("click", function () { ouvrir(item); });
            item.addEventListener("keydown", function (e) {
                if (e.key === "Enter") { ouvrir(item); }
            });
        });

        document.getElementById("lb-fermer").addEventListener("click", fermer);
        document.getElementById("lb-prec").addEventListener("click", function () { changer(-1); });
        document.getElementById("lb-suiv").addEventListener("click", function () { changer(1); });
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) { fermer(); }
        });
        document.addEventListener("keydown", function (e) {
            if (!lightbox.classList.contains("ouverte")) { return; }
            if (e.key === "Escape") { fermer(); }
            if (e.key === "ArrowLeft") { changer(-1); }
            if (e.key === "ArrowRight") { changer(1); }
        });
    }

    /* ---------- 9. Enveloppe de la lettre ---------- */
    var zoneLettre = document.querySelector(".zone-lettre");
    var enveloppe = document.getElementById("enveloppe");
    if (zoneLettre && enveloppe) {
        enveloppe.addEventListener("click", function () {
            var ouverte = zoneLettre.classList.toggle("ouverte");
            enveloppe.setAttribute("aria-expanded", ouverte ? "true" : "false");
            if (ouverte) {
                setTimeout(function () {
                    document.getElementById("lettre").scrollIntoView({ behavior: "smooth", block: "start" });
                }, 500);
            }
        });
    }
});
