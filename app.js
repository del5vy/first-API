const Joi = require("joi");
const config = require("config");
const express = require("express");
const app = express(); //this must always be under express, nothing must come in between dem
const logger = require("./logger");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup");
// const dbDebugger = require("debug")("app:db");

app.use(logger);

console.log(`NODE_ENV: ${process.env.NODE_ENV}`); //THIS IS USED IF U WANT TO WORK WITH NODE ENVIRONMENT

console.log(`app: ${app.get("env")}`);

//MIDDLEWARE
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//helmet use
app.use(helmet());
//this has to be after this helmet
console.log("Application Name" + config.get("name"));
console.log("Mail Server" + config.get("mail.host"));
console.log("Mail Password" + config.get("mail.password"));

// dbDebugger("Connected to database...");

if (app.get("env") === "development") {
  //morgan use
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

app.use(function (req, res, next) {
  console.log("Login...");
  next();
});

app.use(function (req, res, next) {
  console.log("Authenticating...");
  next();
});

const courses = [
  { id: 1, name: "html" },
  { id: 2, name: "css" },
  { id: 3, name: "javascript" },
];

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("the course with the id not found");
  const { error } = validateCourse(req.body);

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  //   const schema = {
  //     name: Joi.string().min(3).required(),
  //     //, if u have email and other inputs, you do the same as above to dem
  //   };
  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("the course with the id not found");

  //   const schema = {
  //     name: Joi.string().min(3).required(),
  //     //, if u have email and other inputs, you do the same as above to dem
  //   };
  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  //   const schema = {
  //     name: Joi.string().min(3).required(),
  //     //, if u have email and other inputs, you do the same as above to dem
  //   };
  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("the course with the id not found");
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port${port} ...`);
});
