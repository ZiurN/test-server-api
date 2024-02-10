const projectChequeForma = {
  cic: 1,
  origen: 1,
  estado: 1,
  motivo: 1,
  codigoOficina: 1,
  calculated: 1,
  oficina: 1,
  cheque: {
    serial: 1,
    monto: 1,
    fecha: 1,
  },
  cuenta: {
    numero: 1
  },
  saldoContable: 1,
  saldoDisponible: 1,
  saldoDisponibleTotal: 1,
  retenciones: 1
}
const projectChequeFondo = {
  estado: 1,
  descripcionEstado: 1,
  accion: 1,
  criterioAutomatico: 1,
  motivo: 1,
  oficina: 1,
  cheque: {
    serial: 1,
    monto: 1,
    fecha: 1,
    origenAccion: 1
  },
  cuenta: {
    numero: 1
  },
  tipoMovimiento: 1,
  saldoContable: 1,
  saldoDisponible: 1,
  saldoDisponibleCalculado: 1,
  saldoDisponibleTotal: 1,
  retenciones: 1
}
const projectDeudaMoraCHIP = {
  detalleDeudaMora: 1,
  deudaMoraTotal: 1
}
const projectDeudaMoraCC = {
  detalleDeudaMora: 1,
  deudaMoraTotal: 1
}
const projectDeudaMoraLeasing = {
  cuotas: 1,
}
const projectDeudaMoraLSG = {
  mensaje: 1,
  numeroCuentaCorriente: 1,
  numeroCuentaSobregiro: 1,
  codigoGarantia: 1,
  rut: 1,
  dv: 1,
  rutAval: 1,
  dvAval: 1,
  valorSpread: 1,
  valorAutorizado: 1,
  porcentajePago: 1,
  fechaVencimiento: 1,
  codigoComision: 1,
  deudaTotal: 1,
  periodoPago: 1,
  seguroDesgravamen: 1,
  codigoTipoPlan: 1,
  seguroCesantia: 1,
  porcentaje: 1,
  estadoCuentaCorriente: 1,
  fechaApertura: 1,
  tipo: 1,
  fechaInicio: 1,
  fechaFin: 1,
  tipoBanco: 1,
  indicador: 1,
  porcentajeDescuento: 1,
  tasa: 1,
  cuenta: 1
}

export { projectChequeForma, projectChequeFondo, projectDeudaMoraCHIP, projectDeudaMoraCC, projectDeudaMoraLeasing, projectDeudaMoraLSG }