var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var db = firebase.database();

// Get project and user data
function getProject(sessionUser, res, projectId) {
  var rulesArray = [];
  db.ref(projectId + "/users").once('value').then(function (snapshot) {
    var developers = snapshot.val();
    for (var property in developers) {
      if (developers.hasOwnProperty(property)) {
        var rule = ".firepad-username-" + property + " { background-color:" + developers[property].highlightColor + "}";
        rulesArray.push(rule);
      }
    }
    res.render("project", {
      loggedUser: {
        color: sessionUser.color,
        username: sessionUser.name,
        rules:rulesArray,
        online:true
      }
    });
  });
}


router.get('/:id', function (req, res, next) {
  var sessionUser = req.session.user;
  getProject(sessionUser, res, req.params.id);
});

module.exports = router;
