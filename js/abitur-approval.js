var votedSubjectResults = getVotedSubjectResults();
var abiturResults = JSON.parse(Cookies.get("AbiturResults"));
var forceVotedSubjects = getForceVotedSubjects();
var optionalSubjects = getOptionalSubjects();
var elected = smartElect();

$(document).ready(function () {
    var result = {
        "courseCount": elected.length >= 40 && getCourseDataMarkSum(elected) / elected.length >= 5,
        "underCourse": getCourseDataMaxMarkCount(elected, 5) <= 7,
        "zeroPointCourse": getCourseDataMaxMarkCount(elected, 1) < 1,
        "abiturMinSum": getArraySum(Object.values(abiturResults)) * 4 >= 100,
        "abiturMinScores": getArrayMaxValCount(Object.values(abiturResults), 5) < 3
    };

    markCards(result);
    var passed = Object.values(result).reduce(function (a, b) { return a && b; });

    $(".passed-text").html(passed ? "Herzlichen Glückwunsch ! Du hast das Abitur bestanden." : "Leider hast du das Abitur nicht bestanden :(")
});

function smartElect() {
    //Works like a charm ^^
    var elected = getSubjectCourseDatas(forceVotedSubjects.slice(0));
    var courseDatas = sortCourseDatas(getSubjectCourseDatas(optionalSubjects));

    for (i = 0; i < courseDatas.length; i++)
    {
        var course = courseDatas[i];

        if(courseCount >= 36 && course["mark"] <= getCourseDataMarkAvg(elected))
            return elected;

        elected.push(course);
    }

    return elected;
}

function getSubjectCourseDatas(subjects) {
    var result = [];
    subjects.forEach(function (subject) { result = result.concat(getSubjectCourseData(subject)); });
    return result;
}

function getCourseDataMaxMarkCount(courseDatas, value) {
    return courseDatas.filter(function (t) { return t["mark"] < value; }).length;
}

function getCourseDataMarkSum(courseDatas) {
    var result = 0;
    courseDatas.forEach(function (courseData) { result += courseData["mark"]; });
    return result;
}

function getCourseDataMarkAvg(courseDatas) {
    return getCourseDataMarkSum(courseDatas) / courseDatas.length;
}

function sortCourseDatas(courseDatas) {
    return courseDatas.sort(function (a, b) {
        return [a["mark"] > b["mark"]] ? -1 : a["mark"] < b["mark"] ? 1 : 0;
    });
}

function getSubjectCourseData(subject) {
    var result = [];

    votedSubjectResults[subject].forEach(function (mark, i) { result.push({
            "subject": subject,
            "gradeId": i,
            "mark": parseInt(mark)
        });
    });

    //Will be voted double
    if(subject === "PF")
        result = result.concat(result);

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

function getArraySum(array){
    if(array.length < 1)
        return 0;

    return array.reduce(function(a, b) { return parseInt(a) + parseInt(b); }, 0);
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