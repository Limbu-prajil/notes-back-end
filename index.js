const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static('build'))

const formatNote = (note) => {
  return {
    id: note._id,
    content: note.content,
    date: note.date,
    important: note.important
  }
}

let notes = [
    {
      id: 1,
      content: 'HTML on helppoa',
      date: '2017-12-10T17:30:31.098Z',
      important: true
    },
    {
      id: 2,
      content: 'Selain pystyy suorittamaan vain javascriptiä',
      date: '2017-12-10T18:39:34.091Z',
      important: false
    },
    {
      id: 3,
      content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
      date: '2017-12-10T19:20:14.298Z',
      important: true
    },
    {
      id: 4,
      content: "PUT and DELETE are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: false
    }
  ]

app.get('/api', (req, res) => {
  res.send('<h1>Hello Prajil!</h1>')
})
  
app.get('/api/notes', (req, res) => {
  Note
    .find({}, {__v: 0})
    .then(notes => {
      res.json(notes.map(formatNote))
    })
})

app.get('/api/notes/:id', (request, response) => {
  /* console.log("id come")
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id )
  if ( note ) {
    response.json(note)
  } else {
    response.status(404).end()
  } */
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(formatNote(note))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

/* app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 1
  const note = request.body
  note.id = maxId + 1
  notes = notes.concat(note)
  response.json(note)
}) */

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })
  Note
    .save()
    .then(formatNote)
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })
})

app.delete('/api/notes/:id', (request, response) => {
  /* const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end() */

  Note
    .findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(204).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note
    .findByIdAndUpdate(request.params.id, note, { new: true } )
    .then(updatedNote => {
      response.json(formatNote(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT ||  3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})