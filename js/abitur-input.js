var abiturSelection = JSON.parse(Cookies.get("AbiturSelection"));
var courseSelection = JSON.parse(Cookies.get("CourseSelection"));
var abiturResults = Cookies.get("AbiturResults");

$(document).ready(function () {

    if(abiturResults != null)
        abiturResults = JSON.parse(abiturResults);

    Object.keys(abiturSelection).forEach(function (key) {
        addRow(key, abiturSelection[key]);
    });
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
        //nextPage();
    }
});

function save() {
    var result = {};

    $(".clickTable tr").each(function () {
        var written = parseInt($(this).find("input").first().val());
        var vocal = parseInt($(this).find("input").last().val());
        
        if(!isNaN(vocal))
            written = (written * 2 + vocal) / 3;

        result[$(this).attr("item-name")] = written;
    });

    alert(JSON.stringify(result));
    Cookies.set("AbiturResults", JSON.stringify(result));
}

function addRow(desc, subject) {
    value = "";

    if(abiturResults != null && !isNaN(abiturResults[subject]))
        value = abiturResults[subject];

    $(".clickTable").first().append("<tr class='no-margin' item-name='" + subject + "'>" +
        "<td>" + desc + "</td>" +
        "<td>" + getDescription(subject) + "</td>" +
        "<td><input value='" + value + "' class='validate required' type='number' min='0' max='15' required></td>" +
        "<td><input value='' class='validate required' type='number' min='0' max='15'></td>" +
        "<tr>");

    $(".clickTable").first().children().last().remove();
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