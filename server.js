import express from 'express'
import { Database } from './database.js'
import { projectCheque } from './projects.js'

const db = new Database('bci1001')
const app = express()
var userAlias;
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.body)
  userAlias = req.body.ejecutivo ?? ''
  next()
})
/**
 * GET urls
 */
app.get('/', (req, res) => {
  console.log('Hello World!')
  res.send('Hello World!')
})
/**
 * POST urls
 */
app.post('/protestos-forma-busquedas/por-ejecutivo-fecha', (req, res) => {
  db.findData('bci_ChequeProtestadoForma', { _userAlias: userAlias}, projectCheque)
    .then(cheques => {
      if (cheques.length === 0) {
        res.status(404).send('No se encontraron cheques protestados para el ejecutivo ' + userAlias)
        return
      }
      res.send(cheques)
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT + '!')
})