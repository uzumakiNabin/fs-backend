const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();

const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

//--------------custom middlewares--------------
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "invalid id format" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

//--------------api endpoints--------------
app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        response.status(400).json({ error: "name must be unique" });
      } else {
        const person = new Person({ name: body.name, number: body.number });
        person
          .save()
          .then((savedPerson) => response.json(savedPerson))
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  if (!body.name || body.name === "" || body.name === null) {
    return response.status(400).json({ error: "name is required" });
  }
  if (!body.number || body.number === "" || body.number === null) {
    return response.status(400).json({ error: "number is required" });
  }

  const person = { name: body.name, number: body.number };
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
