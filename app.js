const express = require("express");
const app = express();
const session = require("express-session");
const fetch = require("node-fetch");
const querystring = require("querystring");

const bodyParser = require("body-parser");

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const AUTH0_DOMAIN = "dev-92nn7edb.auth0.com";
const AUTH0_ID = "YfRZS0bxC4kFrPMFsFFnim0AP1L4If4V";
const AUTH0_SECRET = "kxBC2xsABE3vnAnqPRlRmcreiLdLc--Fe8Q8Pv2K3msXl1BiBGH51NAZfqVoGp-0";

const OS_KEY = "hkABo11OhSUjmTRvKi2AysevY8n2LmI7";

const strategy = new Auth0Strategy({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_ID,
  clientSecret: AUTH0_SECRET,
  callbackURL: "https://localhost:8090/callback"
}, function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
)

passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(session({
  name: "DurHack2019",
  secret: "f2*&HJS87238eaS8*tyJISdaKSOSD42HDAhuYAHGSFYA*@SD&*sddfDS521kSj*AdsjMssAd*%A4",
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// RETRIEVING UPRN
async function uprn(postcode) {
  if (postcode && typeof(postcode) == "string") {
    const response = await fetch("https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?postcode=" + postcode + "&key=" + OS_KEY);
    if (response && response.ok) {
      data = await response.json();
      // this assumes all houses with the same postcode have the same collection date
      return(data.results[0].DPA.UPRN);
    }
  }
}

app.get("/login", passport.authenticate("auth0", {
  scope: "openid email profile"
}), function(req, res) {
  res.redirect("/");
});

app.get("/callback", function(req, res, next) {
  passport.authenticate("auth0", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/" || "/user");
    })
  })
});

app.get("/logout", (req, res) => {
  req.logout();
  let returnTo = req.protocol + "://" + req.hostname;
  const port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ":" + port;
  }
  const logoutURL = new url.URL(
    util.format("https://%s/v2/logout", AUTH0_DOMAIN)
  );
  let searchString = querystring.stringify({
    client_id: AUTH0_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = app;
