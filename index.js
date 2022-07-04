const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(express.static('build'))

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

app.get('/', (req, res) => {
  res.send('<h1>Hello Prajil!</h1>')
})
  
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id )
  if ( note ) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 1
  const note = request.body
  note.id = maxId + 1
  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT ||  3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})