$("#upload").change(function () {
    var reader = new FileReader();
    if (this.files.length) {
        reader.readAsText(this.files[0]);
        $(reader).on('load', processFile);
    }
});

$("#new").click(function () {
    Cookies.remove("CurrentPageId");
    Cookies.remove("AbiturSelection");
    Cookies.remove("CertificateData");
    Cookies.remove("CourseSelection");
    Cookies.remove("AbiturResults");
    window.open("course-selection.html");
});

function processFile(e) {
    var file = e.target.result;

    if (file && file.length && IsJsonString(file) && !isNaN((file = JSON.parse(file))["CurrentPageId"])) {
        setCookie("CurrentPageId", file["CurrentPageId"]);
        setCookie("AbiturSelection", file["AbiturSelection"]);
        setCookie("CertificateData", file["CertificateData"]);
        setCookie("CourseSelection", file["CourseSelection"]);
        setCookie("AbiturResults", file["AbiturResults"]);
        window.open("course-selection.html");
    }
    else
        Materialize.toast("Bitte lade eine gültige Profildatei hoch!", 4000);
}

function setCookie(name, value) {
    if(value == null || typeof value === "undefined")
        Cookies.remove(name);
    else
        Cookies.set(name, value);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}