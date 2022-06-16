function createNewVersion() {
    var versionName = $("#new-version-name").val();
    if (!versionName)
        window.alert("The name of the new version must not be empty");
    else {
        var refEdition = firebase.database().ref(proID + "/versions/");
        refEdition.once('value').then(function (snapshot) {
            if (!snapshot.val() || !snapshot.val()[versionName]) {

                if (activeVersion === "principal") {
                    firebase.database().ref(proID).once('value').then(function (snapshot) {
                        firebase.database().ref(proID + "-" + versionName).set(snapshot.val());
                    });
                } else {
                    firebase.database().ref(proID + "-" + activeVersion).once('value').then(function (snapshot) {
                        firebase.database().ref(proID + "-" + versionName).set(snapshot.val());
                    });
                }


                firebase.database().ref(proID + "/versions/" + versionName).set({
                    createdAt: new Date().getTime(),
                    firepadRef: versionName
                });
            } else {
                window.alert("A version with that name already exists");
            }
        })
    }
}


function loadVersion(snapshot) {
    var versionLabel = snapshot.firepadRef;
    var versionlabelAdapted = versionLabel;
    if (versionLabel.indexOf(' ') > -1) {
        versionlabelAdapted = versionLabel.split(' ').join('_');
    }
    var newItem = $('<div class="row menu-version-item"></div>');

    var colVersionLabel = $('<div id="txt-version-' + versionlabelAdapted + '" class="col-md-12">' + versionLabel + '</div>');
    var colDateLabel = $('<div id="date-txt-version-' + versionlabelAdapted + '" class="col-md-12"> Created on ' + getDateFromTimestamp(snapshot.createdAt) + '</div>');

    var colRestore = $('<div class="col-md-6"></div>');
    var butRestore = $('<a id="restore-version-' + versionlabelAdapted + '" class="btn btn-primary restore-button" name="restorebutton">Switch to this version</a>');
    colRestore.append(butRestore);

    var colUpdate = $('<div class="col-md-6"></div>');
    var butUpdate = $('<a id="update-version-' + versionlabelAdapted + '" class="btn btn-primary update-button" name="updatebutton">Update version</a>');
    colUpdate.append(butUpdate);

    newItem.append(colVersionLabel);
    newItem.append(colDateLabel);
    newItem.append(colRestore);
    newItem.append(colUpdate);

    $('#version-existing').append(newItem);
    $('#restore-version-' + versionlabelAdapted).click(function (e) {
        e.preventDefault();
        changeVersion(versionLabel);
        return false;
    });
    $('#update-version-' + versionlabelAdapted).click(function (e) {
        e.preventDefault();
        updateVersion(versionLabel);
        return false;
    });
}

function changeVersion(versionName) {
    firebase.database().ref(proID).update({
        "activeVersion": versionName
    });
}

function restoreVersion(versionName) {
    var firepadNode = document.getElementById('firepad');
    firepadNode.removeChild(firepadNode.firstChild);
    var ref = firebase.database().ref();

    var activeVersionAdapted = activeVersion;
    if (activeVersion.indexOf(' ') > -1) {
        activeVersionAdapted = activeVersion.split(' ').join('_');
    }

    console.log(activeVersion);

    $('#restore-version-' + activeVersionAdapted).removeClass("disabled");
    $('#update-version-' + activeVersionAdapted).removeClass("disabled");
    $('#txt-version-' + activeVersionAdapted).html(activeVersion);

    var versionNameAdapted = versionName;
    if (versionName.indexOf(' ') > -1) {
        versionNameAdapted = versionName.split(' ').join('%20');
    }

    if (versionName !== "principal") {
        activeFirepadRef = ref.child(proID + "-" + versionName);
        activeVersion = versionName;
        firepadInitialization(activeFirepadRef);
    } else {
        activeFirepadRef = ref.child(proID);
        activeVersion = versionName;
        firepadInitialization(activeFirepadRef);
    }

    activeVersionAdapted = activeVersion;
    if (activeVersion.indexOf(' ') > -1) {
        activeVersionAdapted = activeVersion.split(' ').join('_');
    }

    console.log(activeVersionAdapted);

    $('#restore-version-' + activeVersionAdapted).addClass("disabled");
    $('#update-version-' + activeVersionAdapted).addClass("disabled");
    $('#txt-version-' + activeVersionAdapted).html(activeVersion + " - ACTIVE");
}

function updateVersion(versionName) {
    var versionNameAdapted = versionName;
    if (versionName.indexOf(' ') > -1) {
        versionNameAdapted = versionName.split(' ').join('%20');
    }
    activeFirepadRef.once('value').then(function (snapshot) {
        firebase.database().ref(proID + "-" + versionName).update(snapshot.val());
    });
}

function changePrincipalVersion() {
    firebase.database().ref(proID).update({
        "activeVersion": "principal"
    });
}

function updatePrincipalVersion() {
    activeFirepadRef.once('value').then(function (snapshot) {
        var updateData = {};
        updateData.history = snapshot.val().history;
        firebase.database().ref(proID).update(snapshot.val());
    });
}

function getDateFromTimestamp(stamp) {
    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(stamp / 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getUTCFullYear() + ' at ' + hours + ':' + minutes.substr(-2);
    return formattedTime;
}