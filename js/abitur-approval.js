var votedSubjectResults = getVotedSubjectResults();
var abiturResults = JSON.parse(Cookies.get("AbiturResults"));
var forceVotedSubjects = getForceVotedSubjects();
var optionalSubjects = getOptionalSubjects();

$(document).ready(function () {
    var elected = smartElect();

    var result = {
        "courseCount": getCourseCounts(elected) >= 36 && getPointCounts(elected) >= 200,
        "underCourse": getArrayMaxValCount(getCoursePointsArray(elected), 5) <= 7,
        "zeroPointCourse": getArrayMaxValCount(getCoursePointsArray(elected), 1) < 1,
        "abiturMinSum": getArraySum(Object.values(abiturResults)) * 4 >= 100,
        "abiturMinScores": getArrayMaxValCount(Object.values(abiturResults), 5) < 3
    };

    markCards(result);
    var passed = Object.values(result).reduce(function (a, b) { return a && b; });

    $(".passed-text").html(passed ? "Herzlichen Glückwunsch ! Du hast das Abitur bestanden." : "Leider hast du das Abitur nicht bestanden :(")
});

function getCoursePointsArray(array) {
    var result = [];
    array.forEach(function (t) { result = result.concat(votedSubjectResults[t]); });
    return result;
}

function smartElect() {
    var elected = forceVotedSubjects.slice(0);
    var subjectData = optionalSubjects.slice(0).sort().reverse();

    //Smart elect
    var underCourseCount = getArrayMaxValCount(elected, 5);
    var courseCount = getCourseCounts(elected);

    for (i = 0; i < subjectData.length; i++) {
        if(courseCount >= 36)
            return elected;

        if(underCourseCount + getArrayMaxValCount(votedSubjectResults[subjectData[i]], 5) > 7)
            continue;

        elected.push(subjectData[i]);
        courseCount += getCourseCount(subjectData[i]);
    }

    subjectData = subjectData.filter(function (t) { return !inArray(t, elected)});

    for (i = 0; i < subjectData.length; i++) {
        if(courseCount >= 36)
            return elected;

        elected.push(subjectData[i]);
        courseCount += getCourseCount(subjectData[i]);
    }

    return elected;
}

function getSubjectData(subject) {
    return {
        "subject": subject,
        "has0": getArrayMaxValCount(votedSubjectResults[subject], 1) !== 0,
        "underScoreCount": getArrayMaxValCount(votedSubjectResults[subject], 5),
        "avgScore": getArrayAvg(votedSubjectResults[subject]),
        "courseCount": getCourseCount(subject)
    }
}

function getPointCounts(subjects) {
    var result = 0;
    subjects.forEach(function (t) { result += getArraySum(votedSubjectResults[t]); });
    return result;
}

function getCourseCount(subject) {
    return votedSubjectResults[subject].length;
}

function getCourseCounts(subjects) {
    var result = 0;
    subjects.forEach(function (t) { result += getCourseCount(t) });
    return result;
}

function sortSubjectData(subjectData) {
    return subjectData.sort(function (a, b) {
        if(a["avgScore"] < b["avgScore"])
            return -1;
        else if(a["avgScore"] > b["avgScore"])
            return 1;
        else
            return 0;
    });
}

function getSelectDatas(subjects) {
    var result = [];

    subjects.forEach(function (t) { result.push( {
            name: subject,
            avgPoints: getArrayAvg(votedSubjectResults[subject])
    })});

    return result;
}

function getForceVotedSubjects() {
    var forced = ["D", "M", "GGK", "EV", "ETH", "RK", "PF", "FR", "PH", "CH"];
    var result = Object.keys(abiturResults);

    result = result.concat(forced.filter(function(subject) {
        return isVoted(subject) && !inArray(subject, result);
    }));

    return result;
}

function getOptionalSubjects() {
    //TODO !inArray ?
    return forceVotedSubjects.filter(function (subject) { return inArray(subject, forceVotedSubjects); });
}

function markCards(data) {
    Object.keys(data).forEach(function (key) {
        markCard($("#" + key), data[key]);
    });
}

function isVoted(subject) {
    return inArray(subject, Object.keys(votedSubjectResults));
}

function isAbiturVoted(subject) {
    return inArray(subject, Object.keys(abiturResults));
}

function inArray(value, array) {
    return jQuery.inArray(value, array) !== -1;
}

function markCard(card, passed) {
    if(passed) {
        card.addClass("green");
        card.find("span").first().append("Erfüllt");
        card.find("i").first().addClass("fa-check-circle");
    }
    else {
        card.addClass("red");
        card.find("span").first().append("Nicht Erfüllt");
        card.find("i").first().addClass("fa-times-circle");
    }
}

function getSubjectType (name) {
    var coreNames = ["D", "M", "GGK", "EV", "ETH", "RK", "PF", "FR"];

    if(jQuery.inArray(name, coreNames) !== -1)
        return "core";
    else
        return "optional";
}

function getArraySum(array){
    if(array.length < 1)
        return 0;

    return array.reduce(function(a, b) { return parseInt(a) + parseInt(b); }, 0);
}

function getArrayAvg(array) {
    return getArraySum(array) / array.length;
}

function getArrayMaxValCount(array, value) {
    return array.filter(function (c) { return parseInt(c) < value; }).length;
}

function getVotedSubjectResults() {
    var result = {};
    var certificateData = JSON.parse(Cookies.get("CertificateData"));

    Object.keys(certificateData).forEach(function (certificate) {
        Object.keys(certificateData[certificate]).forEach(function (af) {
            Object.keys(certificateData[certificate][af]).forEach(function (subject) {
                var points = certificateData[certificate][af][subject];

                if(typeof result[subject] === "undefined")
                    result[subject] = [points];
                else
                    result[subject].push(points);
            });
        });
    });

    return result;
}

function save() {

}