(function () {
    "use strict";

    var EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
    var SERVICE_ID = "service_i69ky8n";
    var TEMPLATE_ID = "template_q43b26r";
    var PUBLIC_KEY = "kKTydkU_BYi7-oXJE";
    var MIN_DURATION_SECONDS = 5;
    var MAX_CLICKS = 15;

    function pageLabel() {
        var path = location.pathname.split("/").pop() || "index.html";
        var map = {
            "index.html": "Accueil",
            "": "Accueil",
            "Assurnova.html": "Projet - Assurnova",
            "EuroMoneyAI.html": "Projet - EuroMoneyAI",
            "Medsynora-azure.html": "Projet - MedSynora",
            "Medibot.html": "Projet - Medibot",
            "data-intégration.html": "Projet - Data Intégration"
        };
        return map[path] || path;
    }

    function getJSON(key, fallback) {
        try {
            var raw = sessionStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function setJSON(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
    }

    // --- Session bootstrap (runs on every page load) ---
    var isNewSession = !sessionStorage.getItem("pv_start");

    if (isNewSession) {
        sessionStorage.setItem("pv_start", String(Date.now()));
        sessionStorage.setItem("pv_entry_page", pageLabel());
        sessionStorage.setItem("pv_referrer", document.referrer || "Direct / Accès direct");
        setJSON("pv_pages", [pageLabel()]);
        setJSON("pv_clicks", []);
        sessionStorage.removeItem("pv_sent");
    } else {
        var pages = getJSON("pv_pages", []);
        var current = pageLabel();
        if (pages[pages.length - 1] !== current) {
            pages.push(current);
            setJSON("pv_pages", pages);
        }
    }

    // A page-to-page click was flagged on the previous page; it has done its job
    // (skipping that page's exit-send), so clear it now that the new page has loaded.
    sessionStorage.removeItem("pv_internal_nav");

    // --- Track clicks on important links ---
    function describeLink(el) {
        var href = el.getAttribute("href") || "";

        if (el.id === "cv-download" || el.id === "cv-download-footer" || /\.pdf($|\?)/i.test(href)) {
            return "Téléchargement CV";
        }
        if (href.indexOf("github.com") !== -1) {
            return "Lien GitHub" + (el.closest(".project-card") ? " (depuis un projet)" : "");
        }
        if (href.indexOf("mailto:") === 0) {
            return "Clic contact (email)";
        }
        if (href.indexOf("credly.com") !== -1) {
            return "Certification consultée";
        }
        var card = el.closest(".project-card");
        if (card) {
            return "Projet ouvert : " + (card.getAttribute("data-project") || href);
        }
        return null;
    }

    document.addEventListener(
        "click",
        function (e) {
            var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
            if (!link) return;

            var href = link.getAttribute("href") || "";
            var isInternalPage = /\.html($|[?#])/i.test(href) && href.indexOf("http") !== 0;
            if (isInternalPage) {
                sessionStorage.setItem("pv_internal_nav", "1");
            }

            var label = describeLink(link);
            if (label) {
                var clicks = getJSON("pv_clicks", []);
                if (clicks.length < MAX_CLICKS) {
                    clicks.push(label);
                    setJSON("pv_clicks", clicks);
                }
            }
        },
        true
    );

    // --- Send the visit summary email once, on real exit ---
    function buildPayload() {
        var start = parseInt(sessionStorage.getItem("pv_start"), 10) || Date.now();
        var durationSec = Math.round((Date.now() - start) / 1000);
        var pages = getJSON("pv_pages", [pageLabel()]);
        var clicks = getJSON("pv_clicks", []);
        var ua = navigator.userAgent || "";
        var isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

        return {
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: PUBLIC_KEY,
            template_params: {
                entry_page: sessionStorage.getItem("pv_entry_page") || pageLabel(),
                referrer: sessionStorage.getItem("pv_referrer") || "Direct / Accès direct",
                duration: durationSec + " s",
                pages_visited: pages.join(" -> "),
                clicks: clicks.length ? clicks.join(" | ") : "Aucun clic important",
                device: (isMobile ? "Mobile" : "Ordinateur") + " - " + window.innerWidth + "x" + window.innerHeight
            }
        };
    }

    function trySendVisitEmail() {
        if (sessionStorage.getItem("pv_internal_nav") === "1") return;
        if (sessionStorage.getItem("pv_sent") === "1") return;

        var start = parseInt(sessionStorage.getItem("pv_start"), 10) || Date.now();
        var durationSec = (Date.now() - start) / 1000;
        if (durationSec < MIN_DURATION_SECONDS) return;

        // Lock immediately: visibilitychange and pagehide can both fire for the
        // same exit, so this must not depend on the request's own outcome.
        sessionStorage.setItem("pv_sent", "1");

        var payload = buildPayload();
        // navigator.sendBeacon() always sends with credentials:"include" (fixed
        // by the Beacon spec, not something this code controls). EmailJS's API
        // responds with Access-Control-Allow-Origin: "*", which browsers reject
        // outright for a credentialed request - so sendBeacon can never reach
        // this endpoint. A plain fetch() (default credentials:"same-origin")
        // is accepted, so that's used here instead, even though it is not
        // guaranteed to complete once the page is actually torn down.
        fetch(EMAILJS_ENDPOINT, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(function () {});
    }

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            trySendVisitEmail();
        }
    });
    window.addEventListener("pagehide", trySendVisitEmail);
})();
