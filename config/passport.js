const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const passportJWT = require('passport-jwt');
const jwtOptions = require('./jwtOptions');

const JwtStrategy = passportJWT.Strategy;

const OPTIONS = require('../config/options')
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  User.findOne({ $or: [{ username: new RegExp('^' + username + '$', 'i') }, { email: username }] }, (err, user) => {
    if (err) {
      customErrorLogger(err);
      return done(err);
    }
    if (!user) {
      return done(null, false, { msg: `Invalid credentials.` });
    }
    console.log("Passport found username:", username);
    user.comparePassword(password, (err, isMatch) => {
      console.log("Passport password match error/match:", err, isMatch);
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid credentials.' });
    });
  });
}));


/**
 * RESTful APIs JWT Strategy
 */
passport.use(new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  User.findById(jwt_payload.id, async (err, existingUser) => {
    if (existingUser && existingUser.status === OPTIONS.userStatus.ACTIVE) {
      next(null, existingUser);
    } else {
      next(null, false);
    }
  });
}));


/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/')
    .slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

/**
 * Authorization Required middleware.
 */
exports.isSAAuthorized = function (permission) {
  return function (req, res, next) {
    if (req.user && req.user.isSAGranted(permission)) {
      next();
    } else {
      return res.redirect('/');
    }
  };
};

