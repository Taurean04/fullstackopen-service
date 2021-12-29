const express = require('express');
const morgan = require('morgan');
const app = express();

const PORT = 3001;
app.use(express.json());

app.use(morgan('tiny'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => res.json({persons}));
app.get('/info', (req, res) => {
  let info = {
    message: `Phonebook has info for ${persons.length} people`,
    date: new Date().toString()
  }
  res.json({info});
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === (id));
  if(!person){
    res.status(404).end()
  }
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(n => n.id !== (id));
  res.status(204).end()
});

const generateId = () => {
  const max_id = persons.length > 0 ? Math.floor(Math.random() * 2000) : 0;
  return max_id;
}

app.post('/api/persons', (req, res) => {
  let name = req.body.name;
  let number = req.body.number;
  let name_exists = persons.find(p => p.name === name);
  if(!name || !number){
    return res.status(400).json({error: 'Person name or number is missing'});
  }
  if(!name_exists){
    return res.status(400).json({error: 'name must be unique'});
  }
  const person = {
    name,
    number,
    id: generateId()
  };
  persons = persons.concat(person);
  res.json(person);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));