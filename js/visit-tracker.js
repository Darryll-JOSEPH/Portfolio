(function () {
    "use strict";


    var TRACKING_ENABLED = false;
    if (!TRACKING_ENABLED) return;

    var EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
    var SERVICE_ID = "service_i69ky8n";
    var TEMPLATE_ID = "template_q43b26r";
    var PUBLIC_KEY = "kKTydkU_BYi7-oXJE";
    var MIN_DURATION_SECONDS = 5;
    var MAX_CLICKS = 25;

    var PAGE_LABELS = {
        "index.html": "Accueil",
        "": "Accueil",
        "Assurnova.html": "Projet - Assurnova",
        "EuroMoneyAI.html": "Projet - EuroMoneyAI",
        "Medsynora-azure.html": "Projet - MedSynora",
        "Medibot.html": "Projet - Medibot",
        "data-intégration.html": "Projet - Data Intégration",
        "Lumio.html": "Projet - Lumio"
    };

    function labelForPath(path) {
        return PAGE_LABELS[path] || path;
    }

    function pageLabel() {
        return labelForPath(location.pathname.split("/").pop() || "index.html");
    }

    function pageEntry() {
        return { label: pageLabel(), url: location.href };
    }

    function pushPageEntry(entry) {
        var pages = getJSON("pv_pages", []);
        var last = pages[pages.length - 1];
        if (!last || last.label !== entry.label || last.url !== entry.url) {
            pages.push(entry);
            setJSON("pv_pages", pages);
        }
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
        } catch (e) { }
    }

    // --- Session bootstrap (runs on every page load) ---
    var isNewSession = !sessionStorage.getItem("pv_start");

    if (isNewSession) {
        sessionStorage.setItem("pv_start", String(Date.now()));
        sessionStorage.setItem("pv_entry_page", pageLabel());
        sessionStorage.setItem("pv_referrer", document.referrer || "Direct / Accès direct");
        setJSON("pv_pages", [pageEntry()]);
        setJSON("pv_clicks", []);
        sessionStorage.removeItem("pv_sent");
    } else {
        pushPageEntry(pageEntry());
    }

    // A page-to-page click was flagged on the previous page; it has done its job
    // (skipping that page's exit-send), so clear it now that the new page has loaded.
    sessionStorage.removeItem("pv_internal_nav");

    // --- Track every meaningful click: links, buttons, images ---
    function truncate(text, max) {
        text = (text || "").trim().replace(/\s+/g, " ");
        if (!text) return "";
        return text.length > max ? text.slice(0, max) + "…" : text;
    }

    // Many elements hold both a [data-lang="fr"] and [data-lang="en"] child,
    // toggled via display:none - textContent would otherwise concatenate both.
    function visibleText(el) {
        if (!el) return "";
        var langNodes = el.querySelectorAll ? el.querySelectorAll("[data-lang]") : [];
        for (var i = 0; i < langNodes.length; i++) {
            if (langNodes[i].offsetParent !== null) return langNodes[i].textContent.trim();
        }
        // Trimmed here (not just in truncate()) so a whitespace-only result -
        // common with icon-only buttons/links - is falsy and lets the "||"
        // fallback chain (aria-label, title, ...) in the callers take over.
        return (el.textContent || "").trim();
    }

    function describeLinkClick(el) {
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
        if (href.indexOf("linkedin.com") !== -1) {
            return "Lien LinkedIn";
        }
        var card = el.closest(".project-card");
        if (card) {
            return "Projet ouvert : " + (card.getAttribute("data-project") || href);
        }
        // Generic fallback: the link's own visible text - covers certification
        // links, formation/school links, nav links, "Tous les projets", etc.
        // Icon-only links (back-to-top, socials) have no text, so fall back to
        // aria-label/title before the raw href.
        var text = truncate(visibleText(el) || el.getAttribute("aria-label") || el.title, 60);
        return "Lien cliqué : " + (text || truncate(href, 60));
    }

    function describeButtonClick(el) {
        var text = truncate(visibleText(el) || el.value || el.getAttribute("aria-label") || el.title, 60);
        return "Bouton cliqué : " + (text || truncate(el.className, 40) || "sans libellé");
    }

    function describeImageClick(el) {
        var alt = truncate(el.getAttribute("alt"), 60);
        var src = (el.getAttribute("src") || "").split("/").pop();
        return "Image cliquée : " + (alt || src || "sans description");
    }

    function describeClick(target) {
        if (!target || !target.closest) return null;

        var link = target.closest("a[href]");
        if (link) return describeLinkClick(link);

        var btn = target.closest("button, [type='submit'], [type='button'], [role='button'], .btn");
        if (btn) return describeButtonClick(btn);

        var img = target.closest("img");
        if (img) return describeImageClick(img);

        return null;
    }

    function markInternalNav() {
        sessionStorage.setItem("pv_internal_nav", "1");
        // If this click just changes the page (or navigates to another portfolio
        // page), the script either keeps running on the same document (in-page
        // anchor - nothing reloads) or gets replaced entirely (full page load,
        // which clears this flag itself on the next page - see above). This
        // timeout only matters for the in-page-anchor case, so a later real
        // exit on this same page isn't blocked forever.
        setTimeout(function () {
            sessionStorage.removeItem("pv_internal_nav");
        }, 1500);
    }

    document.addEventListener(
        "click",
        function (e) {
            var label = describeClick(e.target);
            if (label) {
                var clicks = getJSON("pv_clicks", []);
                if (clicks.length < MAX_CLICKS) {
                    clicks.push(label);
                    setJSON("pv_clicks", clicks);
                }
            }

            var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
            if (!link) return;

            // Record the destination page right away, from the click itself,
            // instead of relying only on that page's own script to self-report
            // on load: a very fast visit (click in, then back/close almost
            // immediately) can leave the destination page without enough time
            // to run its own tracking script before the user is already gone.
            try {
                var url = new URL(link.getAttribute("href"), location.href);
                var targetPath = url.pathname.split("/").pop() || "index.html";
                if (url.origin === location.origin && PAGE_LABELS.hasOwnProperty(targetPath)) {
                    var currentPath = location.pathname.split("/").pop() || "index.html";
                    if (targetPath !== currentPath) {
                        pushPageEntry({ label: labelForPath(targetPath), url: url.href });
                    }
                }
            } catch (e) { }

            // Any link click - internal (another portfolio page, an in-page
            // anchor) or external (GitHub, certifications, mailto...) - is just
            // tracked, never an immediate send. External links mostly open in a
            // new tab anyway, so this tab stays open; the email only goes out
            // once this tab is actually closed or sits idle for 5 minutes.
            markInternalNav();
        },
        true
    );

    // --- Send the visit summary email once, on real exit ---
    function buildPayload() {
        var start = parseInt(sessionStorage.getItem("pv_start"), 10) || Date.now();
        var durationSec = Math.round((Date.now() - start) / 1000);
        var pages = getJSON("pv_pages", [pageEntry()]);
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
                pages_visited: pages
                    .map(function (p) {
                        return p.label + " (" + p.url + ")";
                    })
                    .join(" -> "),
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
        // this endpoint. keepalive:true is what lets a fetch() finish even after
        // the tab is actually closed (a plain fetch can get cut off mid-flight);
        // credentials:"omit" is set explicitly so this keepalive request doesn't
        // default to "include" the way sendBeacon does, which would hit the same
        // wall against EmailJS's wildcard CORS response.
        fetch(EMAILJS_ENDPOINT, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
            credentials: "omit"
        }).catch(function () { });
    }

    // pagehide/beforeunload only fire on a real exit (closing the tab/browser,
    // or navigating away) - unlike visibilitychange, which also fires just from
    // switching to another tab or app while this one stays open in the background.
    window.addEventListener("pagehide", trySendVisitEmail);
    window.addEventListener("beforeunload", trySendVisitEmail);

    // Also send if the page is left open without any interaction for 10 minutes,
    // so a visit still gets reported even if the tab is never explicitly closed.
    var INACTIVITY_MS = 10 * 60 * 1000;
    var inactivityTimer = null;

    function resetInactivityTimer() {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(trySendVisitEmail, INACTIVITY_MS);
    }

    ["click", "scroll", "mousemove", "keydown", "touchstart"].forEach(function (evt) {
        window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });
    resetInactivityTimer();
})();
