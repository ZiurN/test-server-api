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
const porjectDeudaMoraLeasing = {
    cuotas: 1,
}

export { projectChequeForma, projectChequeFondo, projectDeudaMoraCHIP, porjectDeudaMoraLeasing }