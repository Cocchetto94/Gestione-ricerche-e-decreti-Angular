const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./be.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
var db = require("./be.json");

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.use(
  jsonServer.rewriter({
    "/api/login": "/login",
    "/api/certificate-present": "/certificate-present",
    "/api/otp": "/otp",
    "/api/users": "/users",
    "/api/contractList": "/contractList",
    "/api/signContract": "/signContract",
    "/api/certificate": "/certificate",
    "/api/sign": "/sign",
    "/api/privacyPolicy": "/privacyPolicy",
    "/api/operationManual": "/operationManual",
  })
);

server.post("/registration", (req, res) => {
  if (req.method === "POST") {
    let id = makeid(5);
    let name = req.body["name"];
    let surname = req.body["surname"];
    let username = req.body["username"];
    let role = req.body["role"];
    let password = req.body["password"];
    let expiry_date = new Date();
    expiry_date = expiry_date.setTime(expiry_date.getTime() + 60 * 60 * 1000);
    db.myUsers.push({
      id,
      name,
      surname,
      username,
      role,
      password,
      expiry_date,
    });
    res.status(200).jsonp("ok");
  }
});

server.post("/login", (req, res) => {
  let username = req.body["username"];
  let password = req.body["password"];

  if (req.method === "POST") {
    if (username && password) {
      let result = db.myUsers.find(
        (user) => user.username === username && user.password === password
      );

      if (result) {
        res.status(200).jsonp(makeid(10));
      } else {
        res.status(400).jsonp({
          error: "Invalid credential",
        });
      }
    }
  }
});

server.post("/changePassword", (req, res) => {
  let username = req.body["username"];
  let password = req.body["password"];
  let newPassword = req.body["newPassword"];

  if (req.method === "POST") {
    if (username && password) {
      let result = db.myUsers.find(
        (user) => user.username === username && user.password === password
      );

      result.password = newPassword;

      if (result) {
        res.status(200).jsonp("ok");
      } else {
        res.status(400).jsonp({
          error: "Invalid credential",
        });
      }
    }
  }
});

server.get("/users", (req, res) => {
  if (req.method === "GET") {
    res.status(200).jsonp(db.myUsers);
  }
});

server.get("/roles", (req, res) => {
  if (req.method === "GET") {
    res.status(200).jsonp(db.roles);
  }
});

server.get("/warrants", (req, res) => {
  if (req.method === "GET") {
    res.status(200).jsonp(db.warrants);
  }
});

server.get("/requests", (req, res) => {
  if (req.method === "GET") {
    res.status(200).jsonp(db.requests);
  }
});

server.get("/warrantRequestType", (req, res) => {
  if (req.method === "GET") {
    res.status(200).jsonp(db.warrantRequestType);
  }
});

server.get("/warrantRequestStatus", (req, res) => {
  if (req.method === "GET") {
    res.status(200).jsonp(db.warrantRequestStatus);
  }
});



function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

server.use(router);
server.listen(port);
