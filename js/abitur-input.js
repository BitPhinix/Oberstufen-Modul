var abiturSelection = JSON.parse(Cookies.get("AbiturSelection"));
var courseSelection = JSON.parse(Cookies.get("CourseSelection"));
var abiturResults = Cookies.get("AbiturResults");

$(document).ready(function () {

    if(abiturResults != null)
        abiturResults = JSON.parse(abiturResults);

    Object.keys(abiturSelection).forEach(function (key) {
        addRow(key);
    });

    $("tr:empty").remove();
});

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
    result["combined"] = {};
    result["written"] = {};
    result["vocal"] = {};

    $(".clickTable tr").each(function () {
        var written = parseInt($(this).find("input").first().val());
        var vocal = parseInt($(this).find("input").last().val());
        var combined = written;
        var name = $(this).attr("item-name");

        if(!isNaN(vocal))
            combined = (written * 2 + vocal) / 3;

        result["combined"][name] = combined;
        result["written"][name] = written;
        result["vocal"][name] = vocal;
    });

    Cookies.set("AbiturResults", JSON.stringify(result));
}

function addRow(key) {
    var written = "";
    var vocal = "";
    var subject = abiturSelection[key];

    if(abiturResults != null && abiturResults["written"][subject] != null)
        written = abiturResults["written"][subject];

    if(abiturResults != null && abiturResults["vocal"][subject] != null)
        vocal = abiturResults["vocal"][subject];

    $(".clickTable").first().append("<tr class='no-margin' item-name='" + subject + "'>" +
        "<td>" + key + "</td>" +
        "<td>" + getDescription(subject) + "</td>" +
        "<td><input value='" + written + "' class='validate required' type='number' min='0' max='15' required></td>" +
        "<td><input value='" + vocal + "' class='validate required' type='number' min='0' max='15'></td>" +
        "<tr>");
}

function getDescription(subject) {
    var desc = "";

    Object.keys(courseSelection).forEach(function (taskfield) {
        Object.keys(courseSelection[taskfield]).forEach(function (key) {
            if(subject == key)
                desc = courseSelection[taskfield][key]["description"];
        });
    });

    return desc;
}