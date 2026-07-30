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
            "Darryll Genève Junior JOSEPH | Data Analyst | Portfolio",

        description:
            "Data Analyst spécialisé en Business Intelligence, Power BI, SQL et Python. Découvrez mes projets d'analyse de données, reporting et visualisation.",

        keywords:
            "Data Analyst, Power BI, SQL, Python, Tableau, Business Intelligence, Reporting, KPI, Data Visualization",

        jobTitle:
            "Data Analyst"
    },

    dads: {
        title:
            "Darryll Genève Junior JOSEPH | Data Analyst • Data Scientist | Portfolio",

        description:
            "Data Analyst et Data Scientist spécialisé en analyse de données, Machine Learning, Business Intelligence et modèles prédictifs.",

        keywords:
            "Data Analyst, Data Scientist, Machine Learning, Python, SQL, Power BI, Scikit-learn, XGBoost, Data Science",

        jobTitle:
            "Data Analyst | Data Scientist"
    },

    dsii: {
        title:
            "Darryll Genève Junior JOSEPH | Data Scientist • AI Engineer | Portfolio",

        description:
            "Data Scientist et AI Engineer spécialisé en Intelligence Artificielle Générative, LLM, RAG, Data Engineering et Cloud Azure.",

        keywords:
            "Data Scientist, AI Engineer, LLM, RAG, LangChain, Azure OpenAI, Databricks, PySpark, Machine Learning",

        jobTitle:
            "Data Scientist | AI Engineer"
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

document.title = config.title;

document.getElementById("page-title").textContent = config.title;

document.getElementById("meta-description").content = config.description;

document.getElementById("meta-keywords").content = config.keywords;

document.getElementById("og-title").content = config.title;

document.getElementById("og-description").content = config.description;

document.getElementById("twitter-title").content = config.title;

document.getElementById("twitter-description").content = config.description;


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

    const cvButton = document.getElementById("cv-download");

    if (cvButton) {
        cvButton.href = cvFiles[cfg];
    }

    /* =====================================================
       Ordre des projets selon le profil
    ===================================================== */

    const PROJECT_ORDER = {

        // Data Analyst
        da: [
            "assurnova",
            "medsynora",
            "euromoney",
            "medibot",
            "integration"
        ],

        // Data Analyst / Data Scientist
        dads: [
            "euromoney",
            "assurnova",
            "medibot",
            "medsynora",
            "integration"
        ],

        // Data Scientist / AI Engineer
        dsii: [
            "medibot",
            "euromoney",
            "integration",
            "medsynora",
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
