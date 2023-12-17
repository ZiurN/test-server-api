import express from 'express'
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  console.log('Hello World!')
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT + '!')
})