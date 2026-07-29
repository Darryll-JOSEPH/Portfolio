document.addEventListener("DOMContentLoaded", () => {

    const cfg = sessionStorage.getItem("portfolioCfg");

    if (!cfg) return;


    document.querySelectorAll('a[href^="index.html"]')
        .forEach(link => {

            const href = link.getAttribute("href");

            const hash =
                href.includes("#")
                    ? href.substring(href.indexOf("#"))
                    : "";


            link.href =
                `index.html?cfg=${cfg}${hash}`;

        });

});
