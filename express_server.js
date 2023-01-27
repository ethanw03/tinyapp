const express = require("express");
const app = express();
const PORT = 8080; //default port 8080

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const urlDatabase = {};

const users = {};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

const findEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email){
      return database[user];
    }
  } return undefined;
}

const urlsUser = (id) => {
  let userURLs = {};
  for (const shortURL in urlDatabase){
    if(urlDatabase.userID === id){
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  } return userURLs;
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
 const userID = req.cookies['user_id'];
 const userURLs = urlsUser(userID);
 let templateVars = { urls: userURLs, user: users[userID]};
 res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies['user_id']
  }
});

app.get("/urls/new", (req, res) => {
  if (req.cookies['user_id']) {
    let templateVars = {user: users[req.cookies['user_id']]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['user_id'];
  const userURLs = urlsUser(userID);
  let templateVars = {
    urls: userURLs,
    user: users[userID],
    shortURL: req.params.shortURL
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if(req.cookies['user_id'] === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if(req.cookies['user_id'] === urlDatabase[shortURL].userID){
    delete urlDatabase[shortURL];
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if(longURL){
    res.redirect(urlDatabase[req.params.shortURL].longURL)
  } else { res.statusCode = 404;
  res.send('<h2>404 Not Found<br>This url does not exist.</h2>')
  }
 
});

app.get('/login', (req, res) => {
  let templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_login', templateVars);
});

app.post("/login", (req, res) => {
  const user = findEmail(req.body.email, users);
  if (user) {
    if (req.body.password === user.password) {
      res.cookie('user_id', user.userID);
      res.redirect('/urls');
    } else {
      res.statusCode = 403;
      res.send('<h2>403 Forbidden<br>You entered the wrong password.</h2>')
    }
  } else {
    res.statusCode = 403;
    res.send('<h2>403 Forbidden<br>This email address is not registered.</h2>')
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.get('/register', (req, res) => {
  let templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_registration', templateVars);
})

app.post('/register', (req, res) => {
  if (req.body.email && req.body.password) {
    if (!findEmail(req.body.email, users)) {
      const userID = generateRandomString();
      users[userID] = {
        userID,
        email: req.body.email,
        password: req.body.password
      }
      res.cookie('user_id', userID);
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
