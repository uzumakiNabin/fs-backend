const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => Number((Math.random() * 10000).toFixed());

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === +id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  if (persons.findIndex((person) => person.id === +id) > -1) {
    persons = persons.filter((person) => person.id !== +id);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});
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
  if (
    persons.findIndex(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    ) > -1
  ) {
    response.status(400).json({ error: "name must be unique" });
    return;
  }

  const newPerson = { id: generateId(), name: body.name, number: body.number };

  persons = persons.concat(newPerson);

  response.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
