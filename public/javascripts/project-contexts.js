// The object to be adapted with each developer context
var highlighter = {};

var editionController = {
    defineSpansMode: function () {}
}

// Object containing all the contexts of the developers
var devContexts = {};

var developers = [];

// Adapt the default context
DefaultTrait = Trait({
    defineVisibility: function () {
        developers.forEach(function (element) {
            if (!devContexts[element.name].isActive()) {
                element.styleRule.style.display = "none";
                //console.log(element.name + " invisible!")
            }
        }, this)
    }
});
contexts.Default.adapt(highlighter, DefaultTrait);



// Defining the edition mode contexts
var ContributionsContext = new Context({
    name: 'contributions'
});
ContributionTrait = Trait({
    defineSpansMode: function () {
        developers.forEach(function (element) {
            var rgb = obtainBgColorNoAlpha(element.styleRule.style);
            element.styleRule.style.backgroundColor = rgb + " 0.25)";
        }, this)
    }
});
ContributionsContext.adapt(editionController, ContributionTrait);


var ProductionContext = new Context({
    name: 'production'
});
ProductionTrait = Trait({
    defineSpansMode: function () {
        developers.forEach(function (element) {
            var rgb = obtainBgColorNoAlpha(element.styleRule.style);
            element.styleRule.style.backgroundColor = rgb + " 0)";
        }, this)
    }
});
ProductionContext.adapt(editionController, ProductionTrait);

// Defining traits for the developers contexts
function loadContext(developerName, developerData) {
    adaptSpecificContext(developerName, developerData);
}

// Define the specific context
function adaptSpecificContext(developerName, developerData) {

    var developerRule = rules[0];
    developers.push({
        name: developerName,
        styleRule: developerRule
    });

    var DevContext = new Context({
        name: developerName,
        highlightColor: developerData.highlightColor
    });
    devContexts[developerName] = DevContext;

    // Sets color highlighthing visible
    HighlightTrait = Trait({
        defineVisibility: function () {
            developerRule.style.display = "inline";
            //console.log(developerName + " visible!")
            this.proceed();
        },
    });
    DevContext.adapt(highlighter, HighlightTrait);
}

function obtainBgColorNoAlpha(rule) {
    var indexStartingBgColor = rule.cssText.indexOf("background-color:");
    var startingsubstrBg = rule.cssText.substring(indexStartingBgColor);
    var indexInitialBgcolor = startingsubstrBg.indexOf(":");
    var indexFinalBgColor = startingsubstrBg.lastIndexOf(",");
    return startingsubstrBg.substring(indexInitialBgcolor + 2, indexFinalBgColor + 1);
}