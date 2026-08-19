/* ===================================================================
 * Hola - Main JS
 *
 * ------------------------------------------------------------------- */
function openLink(event) {
    event.preventDefault(); // Prevent the default behavior of clicking on a link
    event.stopPropagation(); // Stop the event from propagating to the gallery

    // Get the URL from the link's href attribute
    const linkUrl = event.currentTarget.href;

    // Open the link in a new tab or window
    window.open(linkUrl, '_blank');
}
(function ($) {

    "use strict";

    var cfg = {
        scrollDuration: 800, // smoothscroll duration
        mailChimpURL: ''   // mailchimp url
    },

        $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


    /* Preloader
     * -------------------------------------------------- */
    var ssPreloader = function () {

        $("html").addClass('ss-preload');

        // Set a variable to track if the page is loaded
        var pageLoaded = false;

        // Function to hide preloader
        var hidePreloader = function () {
            $("#loader").fadeOut("slow", function () {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            });
        };

        // Show preloader for the first 3 seconds
        setTimeout(function () {
            if (!pageLoaded) {
                hidePreloader();
            }
        }, 3000); // Set the delay time to 3000ms (3 seconds)

        // Check if the page is loaded before the 3-second timeout
        $WIN.on('load', function () {
            pageLoaded = true;
            hidePreloader();

            // force page scroll position to top at page refresh
            // $('html, body').animate({ scrollTop: 0 }, 'normal');

            // for hero content animations
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');

        });
    };



    /* pretty print
     * -------------------------------------------------- */
    var ssPrettyPrint = function () {
        $('pre').addClass('prettyprint');
        $(document).ready(function () {
            prettyPrint();
        });
    };


    /* Move header
     * -------------------------------------------------- */
    var ssMoveHeader = function () {

        var hero = $('.page-hero'),
            hdr = $('header'),
            triggerHeight = hero.outerHeight() - 170;


        $WIN.on('scroll', function () {

            var loc = $WIN.scrollTop();

            if (loc > triggerHeight) {
                hdr.addClass('sticky');
            } else {
                hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.addClass('offset');
            } else {
                hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.addClass('scrolling');
            } else {
                hdr.removeClass('scrolling');
            }

        });

        // $WIN.on('resize', function() {
        //     if ($WIN.width() <= 768) {
        //             hdr.removeClass('sticky offset scrolling');
        //     }
        // });

    };


    /* Mobile Menu
     * ---------------------------------------------------- */
    var ssMobileMenu = function () {

        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');

        toggleButton.on('click', function (event) {
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.on('resize', function () {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        nav.find('a').on("click", function () {

            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle();
            }
        });

    };


    /* Masonry
     * ---------------------------------------------------- */
    var ssMasonryFolio = function () {

        var containerBricks = $('.masonry');

        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.masonry__brick',
                resize: true
            });
        });
    };


    /* photoswipe
     * ----------------------------------------------------- */
    var ssPhotoswipe = function () {
        var items = [],
            $pswp = $('.pswp')[0],
            $folioItems = $('.item-folio');

        // get items
        $folioItems.each(function (i) {

            var $folio = $(this),
                $thumbLink = $folio.find('.thumb-link'),
                $title = $folio.find('.item-folio__title'),
                $caption = $folio.find('.item-folio__caption'),
                $titleText = '<h4>' + $.trim($title.html()) + '</h4>',
                $captionText = $.trim($caption.html()),
                $href = $thumbLink.attr('href'),
                $size = $thumbLink.data('size').split('x'),
                $width = $size[0],
                $height = $size[1];

            var item = {
                src: $href,
                w: $width,
                h: $height
            }

            if ($caption.length > 0) {
                item.title = $.trim($titleText + $captionText);
            }

            items.push(item);
        });

        // bind click event
        $folioItems.each(function (i) {

            $(this).on('click', function (e) {
                e.preventDefault();
                var options = {
                    index: i,
                    showHideOpacity: true
                }

                // initialize PhotoSwipe
                var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                lightBox.init();
            });

        });

    };


    /* slick slider
     * ------------------------------------------------------ */
    var ssSlickSlider = function () {

        $('.testimonials__slider').slick({
            arrows: true,
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: "<div class=\'slick-prev\'><i class=\'im im-arrow-left\' aria-hidden=\'true\'></i></div>",
            nextArrow: "<div class=\'slick-next\'><i class=\'im im-arrow-right\' aria-hidden=\'true\'></i></div>",
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

    };


    /* Highlight the current section in the navigation bar
     * ------------------------------------------------------ */
    var ssWaypoints = function () {

        var navigation_links = $(".header-nav li a");

        // Les liens de nav pointent vers "index.html?cfg=...#section" (pour
        // conserver le profil choisi) et non "#section" seul, donc on ne peut
        // pas les retrouver par un simple attribut href="#id" : on passe par
        // la propriete .hash (fournie par le navigateur), fiable quel que
        // soit le prefixe. On construit aussi la liste des sections a partir
        // de ces memes liens (plutot que .target-section) pour couvrir tout
        // le menu, y compris "A propos" et "Contact".
        var sections = navigation_links
            .map(function () { return this.hash ? this.hash.slice(1) : null; })
            .get()
            .filter(function (id, index, arr) { return id && arr.indexOf(id) === index; })
            .map(function (id) { return document.getElementById(id); })
            .filter(function (el) { return el; });

        if (!sections.length) return;

        $(sections).waypoint({

            handler: function (direction) {

                var active_section = this.element;

                if (direction === "up") {
                    var idx = sections.indexOf(this.element);
                    if (sections[idx - 1]) active_section = sections[idx - 1];
                }

                var id = active_section.id;
                var active_link = navigation_links.filter(function () { return this.hash === "#" + id; });

                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");

            },

            offset: '25%'

        });

    };





    /* Back to Top
     * ------------------------------------------------------ */
    var ssBackToTop = function () {

        var pxShow = 500,   // height on which the button will show
            fadeInTime = 400,   // how slow/fast you want the button to show
            fadeOutTime = 400,   // how slow/fast you want the button to hide
            scrollSpeed = 300,   // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
            goTopButton = $(".go-top")

        // Show or hide the sticky footer button
        $(window).on('scroll', function () {
            if ($(window).scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };


    /* Initialize
     * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssPrettyPrint();
        ssMoveHeader();
        ssMobileMenu();
        ssMasonryFolio();
        ssPhotoswipe();
        ssSlickSlider();
        ssWaypoints();
        ssStatCount();
        ssSmoothScroll();
        ssPlaceholder();
        ssAlertBoxes();
        ssContactForm();
        ssBackToTop();

    })();


})(jQuery);