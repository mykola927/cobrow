function createNewVersion() {
    var versionName = $("#new-version-name").val();
    if (!versionName)
        window.alert("The name of the new version must not be empty");
    else {
        var refEdition = firebase.database().ref(proID + "/versions/");
        refEdition.once('value').then(function (snapshot) {
            if (!snapshot.val() || !snapshot.val()[versionName]) {
                firebase.database().ref(proID + "/versions/" + versionName).set({
                    createdAt: new Date().getTime(),
                    htmlCode: getCurrentCodeHTML()
                }).then(loadVersion(versionName));
            } else {
                window.alert("A version with that name already exists");
            }
        })
    }
}

function getCurrentCodeHTML() {
    var codeInEditor = document.getElementsByClassName("CodeMirror-code")[0];
    var code = codeInEditor.cloneNode(false);
    var lines = codeInEditor.childNodes;
    for (var i = 0; i < lines.length; i++) {
        var lineOfCode = lines[i].childNodes[1].childNodes[0].childNodes;
        var codeHTMLBeforeText = getHTMLBeforeCodeText(lines[i]);
        for (var j = 0; j < lineOfCode.length; j++) {
            var fragmentOfCode = lineOfCode[j];
            var visibleStyle = getComputedStyle(fragmentOfCode).display;
            if (visibleStyle === "inline") {
                codeHTMLBeforeText.childNodes[1].childNodes[0].append(fragmentOfCode.cloneNode(true));
            }
        }
        code.append(codeHTMLBeforeText);
    }
    var wholeInnerHTML = document.createElement("div");
    wholeInnerHTML.appendChild(code);
    return wholeInnerHTML.innerHTML;
}

function getHTMLBeforeCodeText(node) {
    var lineOfCodeHTML = node.cloneNode(true);
    var endNodes = lineOfCodeHTML.childNodes[1].childNodes[0];
    while (endNodes.hasChildNodes()) {
        endNodes.removeChild(endNodes.lastChild);
    }
    return (lineOfCodeHTML);
}

function loadVersion(versionLabel) {

    var newItem = $('<div class="row menu-version-item"></div>');

    var colVersionLabel = $('<div class="col-md-12">' + versionLabel + '</div>');

    var colRestore = $('<div class="col-md-6"></div>');
    var butRestore = $('<a id="restore-version-' + versionLabel + '" class="btn btn-primary restore-button" name="restorebutton">Restore version</a>');
    colRestore.append(butRestore);

    var colUpdate = $('<div class="col-md-6"></div>');
    var butUpdate = $('<a id="update-version-' + versionLabel + '" class="btn btn-primary update-button" name="updatebutton">Update version</a>');
    colUpdate.append(butUpdate);

    newItem.append(colVersionLabel);
    newItem.append(colRestore);
    newItem.append(colUpdate);

    $('#version-existing').append(newItem);
    $('#restore-version-' + versionLabel).click(function (e) {
        e.preventDefault();
        restoreVersion(versionLabel);
        return false;
    });
    $('#update-version-' + versionLabel).click(function (e) {
        e.preventDefault();
        updateVersion(versionLabel);
        return false;
    });

}

function restoreVersion(versionName) {
    var refEdition = firebase.database().ref(proID + "/versions/" + versionName);
    refEdition.once('value').then(function (snapshot) {
        var htmlCode = snapshot.val().htmlCode;
        console.log($(htmlCode)[0]);
        var codemirrorCodeNode = $('.CodeMirror-code')[0];
        var newCode = $(htmlCode)[0];
        while (codemirrorCodeNode.hasChildNodes()) {
            codemirrorCodeNode.removeChild(codemirrorCodeNode.lastChild);
        }
        for (var i = 0; i < newCode.childNodes.length; i++) {
            codemirrorCodeNode.append(newCode.childNodes[i]);
        }
        codeMirror.focus();
        codeMirror.getDoc().setCursor({
            line: 1,
            ch: 0
        });

    });
}



function updateVersion(versionName) {

}