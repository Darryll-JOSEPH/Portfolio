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
            link.href = `${window.location.pathname}?cfg=${cfg}${href}`;
            return;
        }

        // Tous les .html
        if (page.endsWith(".html")) {
            link.href = `${page}?cfg=${cfg}${hash ? "#" + hash : ""}`;
        }

    });

});
