module.exports = function(req, res, next) {
  // Parse user's info from his cookie and set it to req.user
  if (req.session["user"]) {
    req.user = JSON.parse(req.session["user"]);
  } else { req.user = null }
  next();
}
