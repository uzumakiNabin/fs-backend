const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();

const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

// app.get("/info", (request, response) => {
//   response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
// });

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((err) => response.status(400).end());
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   if (persons.findIndex((person) => person.id === +id) > -1) {
//     persons = persons.filter((person) => person.id !== +id);
//     response.status(204).end();
//   } else {
//     response.status(404).end();
//   }
// });
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || body.name === "" || body.name === null) {
    response.status(400).json({ error: "name is required" });
    return;
  }
  if (!body.number || body.number === "" || body.number === null) {
    response.status(400).json({ error: "number is required" });
    return;
  }
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        response.status(400).json({ error: "name must be unique" });
      } else {
        const person = new Person({ name: body.name, number: body.number });
        person.save().then((savedPerson) => response.json(savedPerson));
      }
    })
    .catch((err) => response.status(400).end());
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
