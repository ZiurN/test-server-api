import express from 'express'
import { Database } from './database.js'
import * as proyects from './projects.js'

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
  db.findData('bci_ChequeProtestadoForma', { _userAlias: userAlias}, proyects.projectChequeForma)
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
  db.findData('bci_ChequeProtestadoFondo', { _userAlias: userAlias }, proyects.projectChequeFondo)
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
app.post('/creditos-hipotecarios-busquedas/por-rut-numero-operacion', (req, res) => {
  let numeroOperacion = req.body.numeroOperacion
  db.findData('bci_RegistroDeudaMora', { numeroOperacion: numeroOperacion }, proyects.projectDeudaMoraCHIP)
    .then(results => {
      if (results.length === 0) {
        res.status(404).send('No se encontraron deudas morosas para el número de operación ' + numeroOperacion)
        return
      }
      if (results.length > 1) {
        res.status(500).send('Se encontraron más de una deuda morosa para el número de operación ' + numeroOperacion)
        return
      }
      res.send({detalleDeudaMora: results[0].detalleDeudaMora, deudaMoraTotal: results[0].deudaMoraTotal})
    })
    .catch(err => {
      res.status(500).send(err)
    })
})
app.post('/leasing/obtenerCuota', (req, res) => {
  let numOperacion = req.body.numOperacion
  db.findData('bci_RegistroDeudaMora', { numOperacion: numOperacion }, proyects.porjectDeudaMoraLeasing)
    .then(results => {
      if (results.length === 0) {
        res.status(404).send('No se encontraron deudas morosas para el número de operación ' + numOperacion)
        return
      }
      if (results.length > 1) {
        res.status(500).send('Se encontraron más de una deuda morosa para el número de operación ' + numOperacion)
        return
      }
      res.send({cuotas: results[0].cuotas})
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
      ejecucionCodigo: 'error-no-pagado',
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