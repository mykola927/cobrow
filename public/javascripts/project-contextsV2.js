var highlighter = {};
var highlighters = {};
var devContexts = {};

function loadContext(developerName, developerData) {
    //option1(developerName, developerData);
    option2(developerName, developerData);
}

function option1(developerName, developerData) {
    var rules = styleSheet.cssRules || sheet.rules;
    var developerRule = rules[0];

    // Default color highlighthing adaptation
    DefaultTrait = Trait({
        ['setHighlighthingFor' + developerName]: function () {
            developerRule.style.display = "none";
            console.log("Invisible " + developerName);
        },
        ['active' + developerName]: false
    });
    contexts.Default.adapt(highlighter, DefaultTrait);
    var DevContext = new Context({
        name: developerName,
        highlightColor: developerData.highlightColor
    });
    devContexts[developerName] = DevContext;

    // Sets color highlighthing visible
    HighlightTrait = Trait({
        ['setHighlighthingFor' + developerName]: function () {
            developerRule.style.display = "inline";
            console.log("Visible " + developerName);
        },
        ['active' + developerName]: true
    });
    DevContext.adapt(highlighter, HighlightTrait);

    /*
    var res = [];
    for (var m in DevContext) {
        if (typeof DevContext[m] == "function") {
            res.push(m)
        }
    }
    console.log(devContexts[developerName].adaptationFor(highlighter));
    */
}

function option2(developerName, developerData) {
    var rules = styleSheet.cssRules || sheet.rules;
    var developerRule = rules[0];
    highlighters[developerName] = {};

    // Default color highlighthing adaptation
    DefaultTrait = Trait({
        ['setHighlighthingFor' + developerName]: function () {
            developerRule.style.display = "none";
            console.log("Invisible " + developerName);
        },
        ['active' + developerName]: false
    });
    contexts.Default.adapt(highlighters[developerName], DefaultTrait);
    var DevContext = new Context({
        name: developerName,
        highlightColor: developerData.highlightColor
    });
    devContexts[developerName] = DevContext;

    // Sets color highlighthing visible
    HighlightTrait = Trait({
        ['setHighlighthingFor' + developerName]: function () {
            developerRule.style.display = "inline";
            console.log("Visible " + developerName);
        },
        ['active' + developerName]: true
    });
    DevContext.adapt(highlighters[developerName], HighlightTrait);
    DevContext.activate();

    /*
    var res = [];
    for (var m in DevContext) {
        if (typeof DevContext[m] == "function") {
            res.push(m)
        }
    }
    console.log(devContexts[developerName].adaptationFor(highlighter));
    */
}