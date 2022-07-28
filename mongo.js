const mongoose = require('mongoose')

const url = 'mongodb+srv://fullstack:MongoDB2022@cluster0.gjtbx.mongodb.net/mydatabase'

mongoose.connect(url)
            .then(()=>{
              console.log('connection successful')
            })
            .catch( err=>{
            console.log('error is', err.message)
})

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})
/*
const note = new Note({
  content: 'PUT and DELETE are the most important methods of HTTP protocol',
  date: new Date(),
  important: false
})
note
  .save()
  .then(response => {
    console.log('note saved!')
    console.log(response)
    mongoose.connection.close()
  })
*/

Note
  .find({ important: true })
  .then(result => {
    result.forEach(note => {
      console.log(note);
    })
    mongoose.connection.close()
  })