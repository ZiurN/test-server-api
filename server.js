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
  db.findData('bci_RegistroDeudaMora', { numOperacion: numOperacion }, proyects.projectDeudaMoraLeasing)
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
  let tipoPago = 'PAGO_EXITOSO'
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
            mensaje: 'Error en la consulta de creditos. Numero Oper IIC : NO EXISTE OPERACION-03 ' + numeroOperacion + ' 304',
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
            "detalle": "Error en la consulta de creditos. Numero Oper IIC : NO EXISTE OPERACION-03 " + numeroOperacion + " 304"
          }
        ]
      }
      res.status(400).send(response)
      break
    default:
      res.status(500).send('Tipo de pago no soportado')
      return
  }
})
app.post('/creditos-hipotecarios-pagos/por-numero-operacion', (req, res) => {
  /* para controlar la respuesta */
  let tipoPago = 'PAGO_PARCIAL'
  /* variables del request */
  let cuentaCorriente = req.body.cuentaCorriente.toString()
  let numeroOperacion = req.body.numeroOperacion.toString()
  let cuotasRecibidas = req.body.cuotasMora
  let cuotasFallidas = []
  let cuotasEnDeuda = []
  let response = {
    cuentaCorriente,
    numeroOperacion,
    saldoDisponible: 152000,
  }
  switch (tipoPago) {
    case 'ERROR':
      response = {
        "codigo": "VPE400",
        "mensaje": "Parametros de entrada invalidos",
        "detalles": [
          {
            "id": "identificacionCliente.rut",
            "detalle": "El rut no es valido"
          }
        ]
      }
      res.status(400).send(response)
      break
    case 'PAGO_PARCIAL':
      let montoTotalPagado = 0;
      cuotasRecibidas.forEach((cuota, idx) => {
        if (idx != cuotasRecibidas.length - 1) {
          montoTotalPagado += cuota.totalDividendo
        }
        else {
          cuotasEnDeuda.push({
            numeroCuota: cuota.numeroCuota,
            valorCuota: cuota.totalDividendo,
            fechaVencimiento: '2021-01-12',
            interes: 75000,
            interesPenal: cuota.interesPenal,
            gastoCobranza: cuota.gastoCobranza,
            valorComision: 1200,
            seguroAdicionales: 0,
            subTotal: cuota.subTotal,
            segDesgravamen: 3500,
            seguroIncendio: 4200,
            totalSeguros: 7700,
            totalDividendo: cuota.totalDividendo,
          })
          cuotasFallidas.push({
            numeroCuota: cuota.numeroCuota,
            estado: 'Fallida'
          })
        }
      })
      response.montoPagado = montoTotalPagado
      response.deudaMora = {
        detalleDeudaMora: cuotasEnDeuda,
        deudaMoraTotal: cuotasEnDeuda.reduce((monto, cuota) => monto + cuota.totalDividendo, 0)
      }
      response.cuotasFallidas = cuotasFallidas
      res.status(200).send(response)
      break
    default:
      res.status(500).send('Tipo de pago no soportado')
      return
  }
})
app.post('/lineas-sobregiro-personas-pagos', (req, res) => {
  /* para controlar la respuesta */
  let tipoPago = 'ABONO'
  /* variables del request */
  let numProducto = req.body.numeroProducto.toString()
  switch (tipoPago) {
    case 'PAGO_EXITO':
      responseOK(tipoPago, res, numProducto)
    break
    case 'ABONO':
      responseOK(tipoPago, res, numProducto)
    break
    case 'PAGO_ERROR':
      res.status(400).send({
        codigo: "PAGO_ERROR",
        mensaje: "Error pagando linea sobregiro"
    })
    break
    case 'LPV006':
      res.status(400).send({
        codigo: "LPV006",
        mensaje: "Monto total a pagar mayor a la deuda"
    })
    break
    default:
      res.status(500).send({
        codigo: "LPV006",
        mensaje: "Error con el sistema de pagos, intente de nuevo más tarde"
    })
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

const responseOK = (tipoPago, res, numProducto) => {
  let regExp = new RegExp(`.*${numProducto}`, 'g')
  let filter = {
    $or: [
      { numeroCuentaCorriente: numProducto },
      { numeroCuentaSobregiro: numProducto },
      { numeroCuentaCorriente: { $regex: regExp } },
      { numeroCuentaSobregiro: { $regex: regExp } }
    ]
  }
  db.findData('bci_RegistroDeudaMora', filter, proyects.projectDeudaMoraLSG)
  .then(results => {
    if (results.length === 0) {
      res.status(404).send('No se encontraron deudas morosas para el numero de cuenta ' + numProducto)
      return
    }
    let accountFields = {
      FinServ__FinancialAccountNumber__c: { $regex: regExp }
    }
    db.findData('bci_FinancialAccount', accountFields, proyects.projectFinancialAccount)
      .then(accounts => {
        if (results.length === 0) {
          res.status(404).send('No se encontraron deudas morosas para el numero de cuenta ' + numProducto)
          return
        }
        let mensaje = 'Éxito pagando línea de sobregiro'
        let data = {
          mensaje: null,
          ...results[0],
          montoUtilizado: 12000,
          cuenta: {
            saldoDisponible: accounts[0].FinServ__Balance__c,
            disponibleLinea: 100000
          },
          detalleCuenta: {
            cuenta: results[0].numeroCuentaCorriente,
          }
        }
        let response = {
          codigo: tipoPago,
          mensaje: mensaje,
          data: data
        }
        res.status(200).send(response)
      })
      .catch(err => {
        console.log(err)
        res.status(500).send(err)
      })
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err)
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT + '!')
})