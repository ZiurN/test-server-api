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
  let numOperacion = req.body.numOperacion.toString()
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
app.post('/credito-morosidad/obtener', (req, res) => {
  let numeroOperacion = req.body.numeroOperacion.toString()
  db.findData('bci_RegistroDeudaMora', { numeroOperacion: numeroOperacion }, proyects.projectDeudaMoraCC)
    .then(results => {
      if (results.length === 0) {
        res.status(404).send('No se encontraron deudas morosas para el número de operación ' + numeroOperacion)
        return
      }
      console.log(results)
      res.send({detalleDeudaMora: results[0].detalleDeudaMora, deudaMoraTotal: results[0].deudaMoraTotal})
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
})
app.post('/credito-morosidad/pago', (req, res) => {
  /* para controlar la respuesta */
  let tipoPago = 'PAGO_FALLIDO'
  /* variables del request */
  let rutCliente = req.body.rutCliente.toString()
  let numeroOperacion = req.body.numeroOperacion.toString()
  let cuenta = req.body.cuenta.toString()
  let cuotasRecibidas = req.body.cuotas
  let tipoCargo = req.body.tipoCargo.toString()
  let detallePago = {
    cuenta,
    tipoCargo
  }
  let cuotasEntregadas = []
  let response = {
    rutCliente,
    numeroOperacion,
    detallePago,
  }
  switch (tipoPago) {
    case 'PAGO_EXITOSO':
      cuotasEntregadas = cuotasRecibidas.map(cuota => {
        return {
          numeroCuota: cuota.numeroCuota,
          monto: cuota.montoPagar,
          tipoCancelacion: cuota.tipoCancelacion,
          pagada: true
        }
      })
      let montoTotalPagado = cuotasEntregadas.reduce((monto, cuota) => {
        return monto + Number(cuota.monto)
      }, 0)
      response.detallePago.montoTotalPagado = montoTotalPagado
      response.detallePago.cuotas = cuotasEntregadas
      response.detalleDeudaMora = []
      response.deudaMoraTotal = 0
      console.log(response)
      res.status(200).send(response)
      break
    case 'PAGO_FALLIDO':
      let cuotasEnDeuda = []
      cuotasEntregadas = cuotasRecibidas.map(cuota => {
        cuotasEnDeuda.push({
          "numCuota": cuota.numeroCuota,
          "valorCuota": cuota.montoPagar,
          "fechaVencimiento": "2021-01-12",
          "intereses": cuota.montoPagar * 0.03,
          "interesGenerado": 16294,
          "gastoCobranza": 0,
          "valorComision": 0,
          "totalCuota": cuota.montoPagar,
          "interesesMora": 3989
        })
        return {
          numeroCuota: cuota.numeroCuota,
          monto: cuota.montoPagar,
          tipoCancelacion: cuota.tipoCancelacion,
          pagada: false,
          pagoError: {
            codigo: 'VPE400',
            mensaje: 'Error en la consulta de creditos. Numero Oper IIC : NO EXISTE OPERACION-03 D09077036949 304',
          }
        }
      })
      response.detallePago.montoTotalPagado = 0
      response.detallePago.cuotas = cuotasEntregadas
      response.detalleDeudaMora = cuotasEnDeuda
      response.deudaMoraTotal = cuotasEntregadas.reduce((monto, cuota) => monto + cuota.monto, 0)
      res.status(200).send(response)
      break
    case 'PAGO_PARCIAL':
      montoTotalPagado = 0;
      cuotasEntregadas = cuotasRecibidas.map((cuota, idx) => {
        if (idx != cuotasRecibidas.length - 1) {
          montoTotalPagado += cuota.monto
        }
        else {
          cuotasEnDeuda.push({
            "numCuota": cuota.numeroCuota,
            "valorCuota": cuota.montoPagar,
            "fechaVencimiento": "2021-01-12",
            "intereses": cuota.montoPagar * 0.03,
            "interesGenerado": 16294,
            "gastoCobranza": 0,
            "valorComision": 0,
            "totalCuota": cuota.montoPagar,
            "interesesMora": 3989
          })
        }
        return {
          numeroCuota: cuota.numeroCuota,
          monto: cuota.monto,
          tipoCancelacion: cuota.tipoCancelacion,
          pagada: idx != cuotasRecibidas.length - 1,
          pagoError: idx != cuotasRecibidas.length - 1 ? null : {
            codigo: 'VPE400',
            mensaje: 'Error en la consulta de creditos. Numero Oper IIC : NO EXISTE OPERACION-03 D09077036949 304',
          }
        }
      })
      response.detallePago.montoTotalPagado = montoTotalPagado
      response.detallePago.cuotas = cuotasEntregadas
      response.detalleDeudaMora = [...cuotasEntregadas]
      response.deudaMoraTotal = cuotasEntregadas.reduce((monto, cuota) => monto + cuota.monto, 0)
      res.status(200).send(response)
      break
    case 'ERROR':
      response = {
        "codigo": "VPE400",
        "mensaje": "Parametros de entrada invalidos",
        "detalles": [
          {
            "id": "CMM4",
            "detalle": "Error en la consulta de creditos. Numero Oper IIC : NO EXISTE OPERACION-03 D09077036949 304"
          }
        ]
      }
      break
    default:
      res.status(500).send('Tipo de pago no soportado')
      return
  }
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