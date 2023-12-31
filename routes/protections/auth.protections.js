exports.isAuth = (req, res, next) => {
  if (req.session.userId) next();
  else {
    res.status(401).json({
      authentication: "Unauthorized work on " + req.originalUrl,
    });
  }
};

exports.noAuth = (req, res, next) => {
  if (!req.session.userId) next();
  else {
    res.redirect("/");
  }
};
