var page = window.location.pathname.split("/").pop();
var currentPageId = Cookies.get("CurrentPageId");
var pages = ["course-selection.html", "certificate-input.html", "certificate-input.html", "certificate-input.html", "certificate-input.html", "abitur-selection.html", "abitur-input.html", "abitur-approval.html"];
var reverseAnimsition = Cookies.get("reverseAnimsition");
var preventExit = true;

$(".animsition").animsition({
    inClass: 'fade-in-' + (typeof reverseAnimsition === 'undefined' ? "left" : "right")
});

$(window).on('beforeunload', function() {
    if(preventExit)
        return "Die von dir vorgenommenen Änderungen werden möglicherweise nicht gespeichert.";
});

$("#button-previous").click(function () {
    previousPage();
});

$("#save").find("a").click(function () {
    preventExit = false;
    save();

    var cookies = {
        "CurrentPageId": currentPageId,
        "AbiturSelection": Cookies.get("AbiturSelection"),
        "CertificateData": Cookies.get("CertificateData"),
        "CourseSelection": Cookies.get("CourseSelection"),
        "AbiturResults": Cookies.get("AbiturResults")
    };

    $(this).attr("href", "data:text/plain," + encodeURIComponent(JSON.stringify(cookies)));
});

$(document).ready(function () {
    Cookies.remove("reverseAnimsition");

    if(navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
        preventExit = false;
        document.location.href = "not-supported.html";
        return;
    }

    $('select').material_select();

    if(isNaN(currentPageId))
        currentPageId = 0;

    if(pages[currentPageId] != page)
    {
        preventExit = false;
        document.location.href = pages[currentPageId];
    }
});

function nextPage() {
    preventExit = false;

    if(currentPageId === pages.length - 1)
        return;

    currentPageId++;
    Cookies.set("CurrentPageId", currentPageId);

    $(".animsition").attr("data-animsition-out-class", "fade-out-right");
    $('.animsition').animsition('out', $('.animsition').first(), pages[currentPageId]);
}

function previousPage() {
    preventExit = false;

    if(currentPageId === 0)
        return;

    currentPageId--;
    Cookies.set("CurrentPageId", currentPageId);

    Cookies.set("reverseAnimsition", true);

    $(".animsition").attr("data-animsition-out-class", "fade-out-left");
    $('.animsition').animsition('out', $('.animsition').first(), pages[currentPageId]);
}