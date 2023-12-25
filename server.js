import express from 'express'
import { Database } from './database.js'
import { projectChequeForma, projectChequeFondo } from './projects.js'

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
  db.findData('bci_ChequeProtestadoForma', { _userAlias: userAlias}, projectChequeForma)
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
app.post('/protestos-fondo-busquedas/por-ejecutivo-fecha', (req, res) => {
  db.findData('bci_ChequeProtestadoFondo', { _userAlias: userAlias }, projectChequeFondo)
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
/**
 * PUT urls
 */
app.put('/protestos-fondo', (req, res) => {
  const cheques = req.body.protestos
  const fecha = req.body.fecha
  let responses = []
  cheques.forEach(cheque => {
    let response = {
      ejecucionCodigo: 'protestado',
      cheque: {
          serial: cheque.serial,
          monto: 10,
          fecha: fecha
      }
    }
    responses.push(response)
  })
  res.send(responses)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT + '!')
})