const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Person = require('./models/person');

const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(express.static('build'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body'));

app.get('/', (req, res) => res.send('<h1>PhoneBook Service</h1>'));

app.get('/api/persons', (req, res) => {
  Person.find({})
  .then(persons => {
    res.json(persons);
  });
});

app.get('/info', (req, res) => {
  let info = {
    message: `Phonebook has info for ${persons.length} people`,
    date: new Date().toString()
  }
  res.json(info);
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

app.post('/api/persons', (req, res) => {
  let name = req.body.name;
  let number = req.body.number;
  
  if(!name || !number){
    return res.status(400).json({error: 'Person name or number is missing'});
  }

  Person.findOne({name})
  .then(person => {
    if(person){
      return res.status(400).json({error: 'name must be unique'});
    }else{
      const person = new Person({
        name,
        number
      });
    
      person.save()
      .then(saved => {
        console.log(`Added ${person.name} number ${person.number} to  phonebook`);
        res.json(saved);
      });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));