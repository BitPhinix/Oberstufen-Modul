var courseSelection = JSON.parse(Cookies.get("CourseSelection"));
var abiturSelection = Cookies.get("AbiturSelection");

var voteAble = {
    "3" : ["D", "SP", "EA"],
    "4" : ["D", "SP", "EA", "PH", "CH", "GGK", "RK", "EV", "ETH"],
    "5" : ["D", "SP", "EA", "PH", "CH", "GGK", "RK", "EV", "ETH", "CTM", "CTI", "MUT", "SAF2", "SAF3", "S", "FR"]
};

$(document).ready(function () {
    if(abiturSelection == null) {
        setVoteAbles("3");
        return;
    }
    abiturSelection = JSON.parse(abiturSelection);

    var voted = getVoted();

    if(!Object.keys(abiturSelection).slice(0, -1).some(function (key) {
            if(jQuery.inArray(abiturSelection[key], voted) === -1)
            {
                resetVotes(parseInt(key));
                return true;
            }

            var select = $("select.vote-" + key).first();
            select.empty();
            select.append($("<option value='" + abiturSelection[key] + "' selected>" + getDescription(abiturSelection[key]) + "</option>"));
            select.prop('disabled', true);
            select.material_select();
            return false;
        })) {
        setVoteAbles(5);
        var select = $("select.vote-5").first();
        select.val(abiturSelection[5]);
        select.prop('disabled', false);
        select.material_select();
    }
});

$("select.vote-3").change(function () {
    $("select.vote-4").first().prop('disabled', false);
    $("select.vote-4").first().material_select();
    $(this).prop('disabled', true);
    $(this).material_select();
    setVoteAbles("4");
});

$("select.vote-4").change(function () {
    $("select.vote-5").first().prop('disabled', false);
    $("select.vote-5").first().material_select();
    $(this).prop('disabled', true);
    $(this).material_select();
    setVoteAbles("5");
});

$("i.vote-3").click(function () {
    resetVotes(3);
});

$("i.vote-4").click(function () {
    resetVotes(4);
});

$("i.vote-5").click(function () {
    resetVotes(5);
});

$("#button-next").click(function () {
    var votes = getVotes();

    if(votes.length < 3)
        Materialize.toast("Bitte fülle alle Felder aus !");
    else
    {
        save();
        nextPage();
    }
});

function save() {
    var votes = getVotes();

    Cookies.set("AbiturSelection", JSON.stringify({
        "1" : "PF",
        "2" : "M",
        "3" : votes[0],
        "4" : votes[1],
        "5" : votes[2]
    }));
}

function resetVotes(toVote) {
    var element = $("select.vote-" + toVote).first();

    if(element.val() == null)
        return;

    element.empty();
    element.prop('disabled', false);
    element.material_select();
    setVoteAbles(toVote);

    for (var i = toVote + 1; i <= 5; i++) {
        element = $("select.vote-" + i).first();
        element.empty();
        element.prop('disabled', true);
        element.material_select();
    }
}

function getVoted() {
    var voted = [];

    Object.keys(courseSelection).forEach(function (taskfield) {
        Object.keys(courseSelection[taskfield]).forEach(function (subject) {
            voted.push(subject);
        });
    });

    return voted;
}

function onlyVoted(subjects) {
    var voted = getVoted();
    return subjects.filter(function (subject) { return jQuery.inArray(subject, voted) !== -1 });
}

function setVoteAbles(voteN) {
    var votes = getVotes();

    var votedFields = votes.slice(0);
    votedFields.forEach(function (vote, number) { votedFields[number] = getTaskfield(vote)});
    votedFields = votedFields.filter(function (field) { return field != "none"; });

    var toVote = ["AF2"].filter( function (field) { return jQuery.inArray(field, votedFields) === -1 });
    var voted = getVotes();

    var arr = onlyVoted(voteAble[voteN]).filter(function (vote) { return jQuery.inArray(vote, voted) === -1 });

    if((3 - votes.length) <= toVote.length && toVote.length > 0)
        arr = onlyTaskfields(arr, toVote);

    setSelectElements($("select.vote-" + voteN).first(), arr);
}

function setSelectElements(select, subjects) {
    select.empty();
    select.append($("<option value='' selected disabled></option>"));
    subjects.forEach(function (subject) { select.append(getSelectElement(subject)); });
    select.material_select();
}

function getSelectElement(subject) {
    return $("<option value='" + subject + "'>" + getDescription(subject) + "</option>");
}

function getVotes() {
    return [$("select.vote-3").first().val(), $("select.vote-4").first().val(), $("select.vote-5").first().val()].filter(function (vote) { return vote != "" && vote != null; });
}

function onlyTaskfields(subjects, fields) {
    return subjects.filter(function (subject) { return jQuery.inArray(getTaskfield(subject), fields) !== -1 });
}

function getTaskfield(subject) {
    if(jQuery.inArray(subject, ["FR", "CTI", "MUT", "SAF3"]) !== -1)
        return "AF3";

    if(subject == "SAF2")
        return "AF2";

    if(subject == "EB")
        return "AF1";

    var af = "none";

    Object.keys(courseSelection).forEach(function (taskfield) {
        if(jQuery.inArray(subject, Object.keys(courseSelection[taskfield])) !== -1)
            af = taskfield;
    });

    return af;
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