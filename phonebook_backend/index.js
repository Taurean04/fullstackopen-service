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

app.get('/api/persons', (req, res, next) => {
  Person.find({})
  .then(persons => {
    res.json(persons);
  })
  .catch(e => next(e));
});

app.get('/info', (req, res, next) => {
  Person.find({})
  .then(persons => {
    let info = {
      message: `Phonebook has info for ${persons.length} people`,
      date: new Date().toString()
    }
    res.json(info);
  })
  .catch(e => next(e));
});

app.get('/api/persons/:id', (req, res) => {  
  Person.findById(req.params.id)
  .then(person => {
    if(!person){
      res.status(404).end();
    }
    res.json(person);
  }).catch(e => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    console.log(result);
    res.status(204).end();
  })
  .catch(e => next(e));
});

app.post('/api/persons', (req, res, next) => {
  let name = req.body.name;
  let number = req.body.number;
  
  if(!name || !number){
    return res.status(400).json({error: 'Person name or number is missing'});
  }

  const person = new Person({
    name,
    number
  });

  person.save()
  .then(saved => {
    console.log(`Added ${person.name} number ${person.number} to  phonebook`);
    res.json(saved);
  })
  .catch(e => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  Person.findByIdAndUpdate(req.params.id, {number: body.number}, { new: true })
  .then(updated => {
    res.json(updated);
  })
  .catch(e => next(e));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted ID' });
  }else if (error.name === 'ValidationError') {    
    return res.status(400).send({ error: error.message });
  }
  next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));