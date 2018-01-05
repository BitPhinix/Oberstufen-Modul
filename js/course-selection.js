var courseSelection = Cookies.get("CourseSelection");

$(".clickTable").find("tr").find("td").hover(function() {
    var td = $(this);
    var parent = td.parent();

    if(parent.hasClass("static"))
        return;

    parent.addClass("hover");

    if(parent.prop("clicked"))
        return;

    var length = parseInt(parent.attr("table-selection-length"));
    var index = parent.children().index(this);

    if(isNaN(length))
        length = 4;

    if(index < 1)
        index = 1;

    if(4 - index - length < 0)
        index = 5 - length;

    parent.prop("selected-index", index);
    parent.children().slice(index, index + length).html("<i class='fa fa-circle-o fa-2x'></i>");
}, function() {
    var parent = $(this).parent();

    if(!parent.prop("clicked") && !parent.hasClass("static"))
        parent.children().slice(1).html("");

    parent.removeClass("hover");
});

$(document).ready(function () {
    if(courseSelection == null)
        return;

    courseSelection = JSON.parse(courseSelection);

    Object.keys(courseSelection).forEach(function (field) {
        Object.keys(courseSelection[field]).forEach(function (subject) {
            var table = $('.clickTable tr[item-name=' + subject + ']');
            table.prop("clicked", true);
            Object.keys(courseSelection[field][subject]).slice(1).forEach(function (grade, i) {
                $(table.children()[i + 1]).html(courseSelection[field][subject][grade] ? "<i class='fa fa-times fa-2x'></i>" : "");
            });
        });
    });
});

function ResetGroup (tr) {
    $('.clickTable tr[table-group=' + tr.attr("table-group") + ']').each(function ()
    {
        var tr = $(this);
        tr.prop("clicked", false);
        tr.children().slice(1).each(function () {
            $(this).html("");
        });
    });
}

$(".clickTable").find('tr').click(function() {
    var clicked = $(this).prop("clicked");
    var tr = $(this);

    if(!tr.hasClass("static")) {
        ResetGroup(tr);
        tr.prop("clicked", !clicked);

        if(clicked)
            tr.children().slice(1).html("");
        else {
            var index = parseInt(tr.prop("selected-index"));
            var length = parseInt(tr.attr("table-selection-length"));

            if(isNaN(length))
                length = 4;

            tr.children().slice(index, index + length).html("<i class='fa fa-times fa-2x'></i>");
        }
    }
    else
        Materialize.toast(tr.children().first().html() + " kann nicht abgewählt werden !", 2000);
});

function check(data) {
    var isOk = true;

    if(Object.keys(data["AF1"]).length < 2)
    {
        Materialize.toast("Wähle mindestens 1. Fremdsprache!", 10000);
        isOk = false;
    }

    if(data["optional"]["EB"] != null && data["AF1"]["FR"] == null)
    {
        Materialize.toast("Um Englisch Profilbezogen wählen zu können muss Französisch / Niveau B gewählt werden!", 10000);
        isOk = false;
    }

    if(data["AF1"]["EA"] == null && data["optional"]["EB"] == null)
    {
        Materialize.toast("Wähle Englisch / Niveau A oder Englisch Profilbezogen!", 10000);
        isOk = false;
    }

    if(Object.keys(data["AF2"]).length < 3)
    {
        Materialize.toast("Wähle einen Religionsunterricht!", 10000);
        isOk = false;
    }

    if(data["AF3"]["CH"] == null && data["AF3"]["PH"] == null)
    {
        Materialize.toast("Wähle Physik oder Chemie!", 10000);
        isOk = false;
    }

    return isOk;
}

function serialize() {
    var result = {};

    $(".clickTable").each(function () {
        result[$(this).attr("table-name")] = tableToObj($(this));
    });

    return result;
}

function getGrade(index) {
    if(index == 0)
        return "J1.1";
    else if(index == 1)
        return "J1.2";
    else if(index == 2)
        return "J2.1";
    else if(index == 3)
        return "J2.2";
}

function tableToObj(table) {
    var data = {};

    table.children().each(function (row) {
        var obj = {};
        obj["description"] = $(this).children().first().html().replace(new RegExp(" \\((?!ev|rk).*\\)"), "");

        $(this).children().slice(1).each(function (index) {
            obj[getGrade(index)] = $(this).children().first().hasClass("fa-times");
        });

        if(jQuery.inArray(true, Object.values(obj)) !== -1)
            data[$(this).attr("item-name")] = obj;
    });

    console.log(data);

    return data;
}

$("#button-next").click(function () {
    var data = serialize();

    if(check(data))
    {
        Cookies.set("CourseSelection", JSON.stringify(data));
        nextPage();
    }
});

function save() {
    var data = serialize();
    Cookies.set("CourseSelection", JSON.stringify(data));
}