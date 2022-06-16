function loadDeveloper(developerName, developerData) {

    var newItem = $('<div class="row menu-developers-item"></div>')

    var colColor = $('<div class="col-md-3"></div>');
    var colorIcon = $('<div class="developer-icon-' + developerName + '"></div>');
    $('.developer-icon-' + developerName).css({
        'background': developerData.highlightColor,
        'width': '2em',
        'height': '2em',
    });
    styleSheet.insertRule(".developer-icon-" + developerName + "{ width: 3em; height: 3em; background:" + developerData.highlightColor + ";}", 0);
    colColor.append(colorIcon);

    var colNameStatus = $('<div class="col-md-5"></div>');
    var nameRow = $('<div class="row"></div>');
    var nameCol = $('<div class="col-md-12">' + developerName + '</div>');
    nameRow.append(nameCol);
    colNameStatus.append(nameRow);

    var statusRow = $('<div class="row"></div>');
    var textCol = $('<div id="status-text-' + developerName + '" class="col-md-5">' + (developerData.online ? 'Online' : 'Offline') + '</div>');
    var iconCol = $('<div id="status-icon-' + developerName + '" class="col-md-4"><div class="' + (developerData.online ? 'online-icon' : 'offline-icon') + '"></div></div>');
    statusRow.append(textCol);
    statusRow.append(iconCol);
    colNameStatus.append(statusRow);

    var colCheckbox = $('<div id="check-' + developerName + '" class="col-md-3"></div>');
    var checkbox = $('<input type="checkbox" name="check-' + developerName + '" value="check-' + developerName + '" ' + 'checked>');
    colCheckbox.append(checkbox);

    newItem.append(colColor);
    newItem.append(colNameStatus);
    newItem.append(colCheckbox);

    $('#developers-list').append(newItem);

    $('#check-' + developerName + ' input[type=checkbox]').change(
        function toggleHhighlighting() {
            var ref = firebase.database().ref(proID + "/users/" + developerName);
            ref.update({
                active: $(this).is(':checked')
            });
        });
}

// Update the checked status
function updateActiveInactiveStatus(developerName, snapshotStatus) {
    var checked = snapshotStatus.val();
    $('#check-' + developerName + ' input[type=checkbox]').prop('checked', checked).change();
    if (checked && devContexts[developerName].activationCount === 0)
        devContexts[developerName].activate();

    else if (devContexts[developerName].activationCount > 0)
        devContexts[developerName].deactivate();

    highlighter.defineVisibility();
}

// Update the online status and the icons
function updateOnlineOfflineStatus(developerName, snapshotStatus) {
    $('#status-text-' + developerName).replaceWith('<div id="status-text-' + developerName + '" class="col-md-5">' + (snapshotStatus.val() ? 'Online' : 'Offline') + '</div>');
    $('#status-icon-' + developerName).replaceWith('<div id="status-icon-' + developerName + '" class="col-md-4"><div class="' + (snapshotStatus.val() ? 'online-icon' : 'offline-icon') + '"></div></div>');
}