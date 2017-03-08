module.exports = function(req, res, next) {

  // Parse user's info from his cookie and set it to req.user
  if (req.session["user"]) {
    req.user = JSON.parse(req.session["user"]);
  } else { req.user = null }

  if (req.session["pharmacy"]) {
    req.pharmacy = JSON.parse(req.session["pharmacy"]);
  } else { req.pharmacy = null }
  next();

}
