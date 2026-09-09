document.addEventListener("DOMContentLoaded", () => {

    const VALID_CFG = ["da", "dads", "dsii"];

    const params = new URLSearchParams(window.location.search);
    let cfg = params.get("cfg");

    // Si le cfg est présent dans l'URL, on le sauvegarde
    if (VALID_CFG.includes(cfg)) {
        sessionStorage.setItem("portfolioCfg", cfg);
    } else {
        // Sinon on récupère celui de la session
        cfg = sessionStorage.getItem("portfolioCfg") || "da";
    }

    // CV sur-mesure (candidature via l'agent IA) — voir portfolio-config.js
    // pour le détail. Lu uniquement depuis l'URL courante : absent => CV
    // générique du profil (cfg), toujours. La persistance d'une page à
    // l'autre passe par les liens internes réécrits plus bas.
    const SUPABASE_DOCS_BASE = "https://ftgbtlgybubhpsxwwlbh.supabase.co/storage/v1/object/public/documents";

    const candidateId = params.get("id") || null;

    // Affichage data-role (contenu spécifique au profil ciblé)
    document.querySelectorAll("[data-role]").forEach(el => {
        el.style.display = el.dataset.role === cfg ? "inline" : "none";
    });

    // CV téléchargeable selon le profil ciblé
    const cvFiles = {
        da: "assets/cv/cv_Darryll_JOSEPH_data_analyst.pdf",
        dads: "assets/cv/cv_Darryll_JOSEPH_data_analyst_data_scientist.pdf",
        dsii: "assets/cv/cv_Darryll_JOSEPH_data_scientist_ia_engineer.pdf"
    };
    const cvButton = document.getElementById("cv-download-footer");
    if (cvButton) cvButton.href = cvFiles[cfg];

    // Si un id de candidature est présent, on tente de basculer sur le CV
    // sur-mesure (Supabase Storage) ; sinon on garde le CV générique ci-dessus.
    if (candidateId) {
        const candidateCvUrl = `${SUPABASE_DOCS_BASE}/${encodeURIComponent(candidateId)}/cv.pdf`;

        fetch(candidateCvUrl, { method: "HEAD" })
            .then(res => {
                if (res.ok && cvButton) cvButton.href = candidateCvUrl;
            })
            .catch(() => { });
    }

    const persistedParams = candidateId
        ? `cfg=${cfg}&id=${encodeURIComponent(candidateId)}`
        : `cfg=${cfg}`;

    document.querySelectorAll("a[href]").forEach(link => {

        const href = link.getAttribute("href");
        if (!href) return;

        // Liens externes
        if (
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {
            return;
        }

        // Déjà un cfg
        if (href.includes("cfg=")) return;

        const [page, hash] = href.split("#");

        // Ancres
        if (href.startsWith("#")) {
            link.href = `${window.location.pathname}?${persistedParams}${href}`;
            return;
        }

        // Tous les .html
        if (page.endsWith(".html")) {
            link.href = `${page}?${persistedParams}${hash ? "#" + hash : ""}`;
        }

    });

});
