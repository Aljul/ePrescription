module.exports = function(req, res, next) {
  // Build username of loggedin user from his first and last name
  if (req.session["user"]) {
    req.user = JSON.parse(req.session["user"]);
  } else { req.user = null }
  next();
}
