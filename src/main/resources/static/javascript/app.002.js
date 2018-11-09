$(function() {
    // Make menus drop down automatically.
    $('ul.nav li.dropdown').hover(function() {
        $('.dropdown-menu', this).stop(true, true).delay(100).fadeIn(500);
    }, function() {
        $('.dropdown-menu', this).stop(true, true).delay(100).fadeOut(500);
    });
});

$(function() {
    $(document).ready(function() {
        // navigation click actions
        $('.scroll-link').on('click', function(event) {
            event.preventDefault();
            var sectionID = $(this).attr("data-id");
            scrollToID('#' + sectionID, 750);
        });
        // scroll to top action
        $('.scroll-top').on('click', function(event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
        });
    });

    // scroll function
    function scrollToID(id, speed) {
        var $body = $('body');
        var offSet = $body.css('padding-top').split('px')[0];
        var targetOffset = $(id).offset().top - offSet;
        var mainNav = $('#main-nav');
        $('html,body').animate({
            scrollTop: targetOffset
        }, speed);
        if (mainNav.hasClass("open")) {
            mainNav.css("height", "1px").removeClass("in").addClass("collapse");
            mainNav.removeClass("open");
        }
    }
    if (typeof console === "undefined") {
        console = {
            log: function() {
            }
        };
    }
});
// statusbar effects
var navbar = $("#statusbar");
var pushDown = $("#main");

$(window).scroll(function() {
    if ($(this).scrollTop() > 90) {
        $(navbar).addClass('fade-in')
        $(pushDown).addClass("margin");
    } else {
        $(navbar).removeClass('fade-in')
        $(pushDown).removeClass("margin");
    }
    if ($(window).width() <= 960) {
        $(navbar).removeClass('fade-in')
        $(pushDown).removeClass("margin");
    }
});
