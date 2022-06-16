// Creates a download of the code currently showing in the editor
function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(getCurrentCode()));
    var fileName = $("#generated-file-name").val();
    if (fileName) {
        element.setAttribute('download', fileName + ".js");
    } else {
        element.setAttribute('download', "file.js");
    }

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Returns only the active code in the editor
function getCurrentCode() {
    var code = "";
    var codeInEditor = document.getElementsByClassName("CodeMirror-code")[0];
    var lines = codeInEditor.childNodes;
    for (var i = 0; i < lines.length; i++) {
        var lineOfCode = lines[i].childNodes[1].childNodes[0].childNodes;
        for (var j = 0; j < lineOfCode.length; j++) {
            var fragmentOfCode = lineOfCode[j];
            var visibleStyle = getComputedStyle(fragmentOfCode).display;
            if (visibleStyle === "inline") {
                code += fragmentOfCode.innerHTML;
            }
        }
        code += "\n";
    }
    return code;
}