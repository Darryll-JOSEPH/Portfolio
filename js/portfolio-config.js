/* =====================================================
   Portfolio Dynamic Configuration
   URL :
   ?cfg=da
   ?cfg=dads
   ?cfg=dsii
===================================================== */

const PORTFOLIO_CONFIG = {

    da: {
        title:
            "Darryll JOSEPH | Data Analyst Portfolio",

        description:
            "Darryll JOSEPH, Data Analyst spécialisé en Business Intelligence, Power BI, SQL et visualisation de données. Découvrez mes projets et compétences.",

        keywords:
            "Data Analyst, Power BI, SQL, DAX, Business Intelligence, Data Visualization, Excel, Tableau de bord",

        jobTitle:
            "Data Analyst"
    },

    dads: {
        title:
            "Darryll JOSEPH | Data Analyst & Data Scientist Portfolio",

        description:
            "Darryll JOSEPH, Data Analyst & Data Scientist spécialisé en Machine Learning, analyse statistique et Business Intelligence.",

        keywords:
            "Data Analyst, Data Scientist, Machine Learning, Python, SQL, Power BI, Statistiques",

        jobTitle:
            "Data Analyst & Data Scientist"
    },

    dsii: {
        title:
            "Darryll JOSEPH | Data Scientist & AI Engineer Portfolio",

        description:
            "Darryll JOSEPH, Data Scientist & AI Engineer spécialisé en Machine Learning, IA Générative, LLM et architectures Data Cloud.",

        keywords:
            "Data Scientist, AI Engineer, Machine Learning, Deep Learning, IA Générative, LLM, RAG, Python, Cloud",

        jobTitle:
            "Data Scientist & AI Engineer"
    }
};


/* =====================================================
   Lecture configuration
===================================================== */

const VALID_CFG = ["da", "dads", "dsii"];

const params = new URLSearchParams(window.location.search);

let cfg = params.get("cfg");

/* =====================================================
   Solution 2 : Session Storage
===================================================== */
if (VALID_CFG.includes(cfg)) {

    sessionStorage.setItem(
        "portfolioCfg",
        cfg
    );

} else {

    cfg =
        sessionStorage.getItem("portfolioCfg")
        || "da";

}


const config = PORTFOLIO_CONFIG[cfg];


/* =====================================================
   Mise à jour SEO
===================================================== */

function setIfNotEmpty(id, prop, value) {
    if (!value) return; // ne jamais écraser une valeur existante avec du vide
    const el = document.getElementById(id);
    if (el) el[prop] = value;
}

document.title = config.title;

setIfNotEmpty("page-title", "textContent", config.title);
setIfNotEmpty("meta-description", "content", config.description);
setIfNotEmpty("meta-keywords", "content", config.keywords);
setIfNotEmpty("og-title", "content", config.title);
setIfNotEmpty("og-description", "content", config.description);
setIfNotEmpty("twitter-title", "content", config.title);
setIfNotEmpty("twitter-description", "content", config.description);


/* =====================================================
   DOM Ready
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       Affichage data-profile
    =========================== */

    document.querySelectorAll("[data-profile]").forEach(element => {

        element.style.display =
            element.dataset.profile === cfg ? "inline" : "none";

    });


    /* ===========================
       Affichage data-role
    =========================== */

    document.querySelectorAll("[data-role]").forEach(element => {

        element.style.display =
            element.dataset.role === cfg ? "inline" : "none";

    });


    /* =====================================================
    Conserver cfg sur tous les liens internes
    ===================================================== */
    document.querySelectorAll("a[href]").forEach(link => {

        const href = link.getAttribute("href");
        if (!href) return;

        // Liens externes
        if (
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) return;

        // Ne pas modifier si cfg déjà présent
        if (href.includes("cfg=")) return;

        // Séparer le hash éventuel
        const [page, hash] = href.split("#");

        // Ancres de la page courante
        if (href.startsWith("#")) {
            link.href = `${window.location.pathname}?cfg=${cfg}${href}`;
            return;
        }

        // Ajouter cfg à TOUS les fichiers html
        if (page.endsWith(".html")) {
            link.href = `${page}?cfg=${cfg}${hash ? "#" + hash : ""}`;
        }

    });



    /* =====================================================
    CV selon le profil
    ===================================================== */

    const cvFiles = {
        da: "assets/cv/cv_Darryll_JOSEPH_data_analyst.pdf",
        dads: "assets/cv/cv_Darryll_JOSEPH_data_analyst_data_scientist.pdf",
        dsii: "assets/cv/cv_Darryll_JOSEPH_data_scientist_ia_engineer.pdf"
    };

    const cvButtons = [
        document.getElementById("cv-download"),
        document.getElementById("cv-download-footer")
    ];

    cvButtons.forEach(btn => {
        if (btn) btn.href = cvFiles[cfg];
    });

    /* =====================================================
       Ordre des projets selon le profil
    ===================================================== */

    const PROJECT_ORDER = {

        // Data Analyst
        da: [
            "assurnova",
            "retail",
            "financial",
            "lumio",
            "medsynora",
            "euromoney",
            "cohortchurn",
            "medibot",
            "integration"
        ],

        // Data Analyst / Data Scientist
        dads: [
            "financial",
            "cohortchurn",
            "euromoney",
            "retail",
            "lumio",
            "assurnova",
            "medibot",
            "medsynora",
            "integration"
        ],

        // Data Scientist / AI Engineer
        dsii: [
            "medibot",
            "cohortchurn",
            "euromoney",
            "integration",
            "financial",
            "medsynora",
            "lumio",
            "retail",
            "assurnova"
        ]

    };

    const grid = document.querySelector(".projects-grid");

    if (grid && PROJECT_ORDER[cfg]) {

        const cards = {};

        grid.querySelectorAll(".project-card").forEach(card => {
            cards[card.dataset.project] = card;
        });

        PROJECT_ORDER[cfg].forEach(id => {
            if (cards[id]) {
                grid.appendChild(cards[id]);
            }
        });
    }




});
