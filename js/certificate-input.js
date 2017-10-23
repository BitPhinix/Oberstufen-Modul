var certificateData = Cookies.get("CertificateData");
var courseSelection = JSON.parse(Cookies.get("CourseSelection"));
var currentPageId = Cookies.get("CurrentPageId");
var grade;

$(document).ready(function () {
    grade = "J" + Math.ceil(currentPageId / 2) + "." + (((currentPageId - 1) % 2) + 1);
    $(".cert-title").html("Zeugnis " + grade);

    if(certificateData != null)
        certificateData = JSON.parse(certificateData);
    else
        certificateData = {};

    loadCertificate();
});

function loadCertificate() {
    Object.keys(courseSelection).forEach(function (table) {
        var obj = $('.clickTable[table-name="' + table + '"]').first();
        Object.keys(courseSelection[table]).forEach(function (key) {
            if(courseSelection[table][key][grade])
                addRow(obj, table, key);
        });
    });

    $("tr:empty").remove();
}

$("#button-next").click(function () {
    var isOk = true;

    $(".clickTable input").each(function () {
        isOk &= this.validity.valid;
    });

    if(!isOk)
        Materialize.toast("Fülle alle Felder korrekt aus!", 4000);
    else {
        save();
        nextPage();
    }
});

function save() {
    var result = {};
    $(".clickTable").each(function () {
        var table = $(this);
        result[table.attr("table-name")] = {};
        table.children().each(function () {
            result[table.attr("table-name")][$(this).attr("item-name")] = $(this).find("input").first().val();
        });
    });
    certificateData[grade] = result;
    Cookies.set("CertificateData", certificateData);
}

function addRow(table, field, subject) {
    value = "";

    if(certificateData != null && certificateData[grade] != null && !isNaN(certificateData[grade][field][subject]))
        value = certificateData[grade][field][subject];

    table.children().last().remove();
    table.append("<tr class='no-margin' item-name='" + subject + "'><td>" + courseSelection[field][subject]["description"] + "</td><td><input class='validate' type='number' min='0' max='15' value='" + value + "' required></td><tr>");
}