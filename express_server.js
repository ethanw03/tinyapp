const express = require("express");
const app = express();
const PORT = 8080; //default port 8080

const { findEmail } = require('./helpers')

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session', 
  secret: 'alpha-beta-theta-tomatoe'
}))

const bcrypt = require('bcryptjs');

const urlDatabase = {};

const users = {};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}


const urlsUser = (id, database) => {
  let userURLs = {};
  for (const shortURL in database){
    if(database[shortURL].userID === id){
      userURLs[shortURL] = database[shortURL];
    }
  } return userURLs;
}


app.get("/", (req, res) => {
  if(req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login')
  }
});

app.get("/urls", (req, res) => {
 const userID = req.session.user_id;
 const userURLs = urlsUser(userID, urlDatabase);
 let templateVars = { urls: userURLs, user: users[userID]};
 res.render('urls_index', templateVars);
 if (!userID) {
  res.statusCode = 401;
 }
 res.render('urls_index', templateVars)
});

app.post("/urls", (req, res) => {
  if(req.session.user_id){
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
} else {
  res.redirect('/login')
}
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {user: users[req.session.user_id]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  } 
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;
  const userURLs = urlsUser(userID, urlDatabase);
  let templateVars = { urlDatabase, userURLs, shortURL, user: users[userID]
  };
  if(!urlDatabase[shortURL]) {
    res.statusCode = 404;
    res.send('<h2>404  Bad Request<br>This URL does not exist.</h2>')
  } else if (!userID || !userURLs[shortURL]){
    res.statusCode = 401;
    res.send('<h2>401 <3 Bad Request<br>You do not have permission to access these URLS.</h2>')
  } else {
  res.render("urls_show", templateVars);
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if(req.session.user_id && req.session.user_id === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
    res.redirect(`/urls`);
  } else {
    res.statusCode = 401;
    res.send('<h2>401  Bad Request<br>You do not have permission to access these URLS.</h2>')
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if(req.session.user_id && req.session.user_id === urlDatabase[shortURL].userID){
    delete urlDatabase[shortURL];
    res.redirect('/urls')
  } else {
    res.statusCode = 401;
    res.send('<h2>401  Bad Request<br>You do not have permission to access these URLS.</h2>')
  }
});

app.get("/u/:shortURL", (req, res) => {
  if(urlDatabase[req.params.shortURL]){
    res.redirect(urlDatabase[req.params.shortURL].longURL)
  } else { 
  res.statusCode = 404;
  res.send('<h2>404 Not Found<br>This url does not exist.</h2>')
  }
});

app.get('/login', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
    return;
  }
  let templateVars = {user: users[req.session.user_id]};
  res.render('urls_login', templateVars);
});

app.post("/login", (req, res) => {
  const user = findEmail(req.body.email, users);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.user_id;
      res.redirect('/urls');
    } else {
      res.statusCode = 403
      res.send('<h2>403 Forbidden<br>You entered the wrong password or email.</h2>')
    } 
});

app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/urls');
})

app.get('/register', (req, res) => {
  if (req.session.user_id){
    res.redirect('/urls');
    return;
  } 
  let templateVars = {user: users[req.session.user_id]};
  res.render('urls_registration', templateVars);
});

app.post('/register', (req, res) => {
  if (req.body.email && req.body.password) {
    if (!findEmail(req.body.email, users)) {
      const userID = generateRandomString();
      users[userID] = {
        userID,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      }
      req.session.user_id  = userID;
      res.redirect('/urls');
    } else {
      res.statusCode = 400;
      res.send('<h2>400  Bad Request<br>Email already registered.</h2>')
    }
  } else {
    res.statusCode = 400;
    res.send('<h2>400  Bad Request<br>Please fill out the email and password fields.</h2>')
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
