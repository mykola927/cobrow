function updateEditionMode(snapshotEdition) {
    var newMode = snapshotEdition.val();
    $("input:radio[name=selected_edition_mode][value =" + newMode + "]").prop('checked', true).change();

    if (newMode === 'contribution') {
        if (ContributionsContext.activationCount === 0)
            ContributionsContext.activate();

        if (ProductionContext.activationCount > 0)
            ProductionContext.deactivate();
    } else if (newMode === 'production') {
        if (ProductionContext.activationCount === 0)
            ProductionContext.activate();

        if (ContributionsContext.activationCount > 0)
            ContributionsContext.deactivate();
    }
    editionController.defineSpansMode();
}

function prepareRadio() {
    $("input:radio[name=selected_edition_mode]").change(
        function toggleEdition() {
            var ref = firebase.database().ref(proID);
            if (this.value == 'contribution') {
                ref.update({
                    edition: 'contribution'
                });
            } else if (this.value == 'production') {
                ref.update({
                    edition: 'production'
                });
            }

        });
}