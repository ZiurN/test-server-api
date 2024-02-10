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
const projectFinancialAccount = {
  Id: 1,
  OwnerId: 1,
  Name: 1,
  RecordTypeId: 1,
  'RecordType.Name': 1,
  'RecordType.DeveloperName': 1,
  FinServ__FinancialAccountNumber__c: 1,
  FinServ__FinancialAccountSource__c: 1,
  FinServ__FinancialAccountType__c: 1,
  FinServ__OwnerType__c: 1,
  FinServ__PrimaryOwner__c: 1,
  'FinServ__PrimaryOwner__r.bci_cli_rut__c': 1,
  'FinServ__PrimaryOwner__r.Name': 1,
  FinServ__RecordTypeName__c: 1,
  FinServ__Status__c: 1,
  FinServ__Balance__c: 1,
  bci_BiPersonal__c: 1,
  bci_ind_tipo_mov__c: 1,
  bci_ind_var_precio__c: 1,
  bci_mon_act__c: 1,
  bci_mon_cuota__c: 1,
  bci_mon_inv_ini__c: 1,
  bci_mon_tot_tasa_spread__c: 1,
  bci_moneda__c: 1,
  bci_tasa__c: 1,
  bci_ult_chq_cobrados__c: 1,
  bci_id_financialaccount__c: 1,
  bci_aux_detalle_mora__c: 1,
  bci_cnt_dias_mora__c: 1,
  bci_flg_pago_transito__c: 1,
  bci_prod_code__c: 1,
  bci_fec_primer_venc__c: 1,
  bci_nom_ejecutivo_comex__c: 1,
  bci_nom_ejecutivo_leasing__c: 1,
  bci_num_rentas_act_vs_total__c: 1,
  bci_cod_cartera_inv__c: 1,
  bci_cod_cuenta_inv__c: 1,
  bci_cod_prod_inv__c: 1,
  bci_cod_regimen_tributario__c: 1,
  bci_cod_tipo_cartera__c: 1,
  bci_fec_ven__c: 1,
  bci_num_cuenta_tdc__c: 1
}

export {
  projectChequeForma,
  projectChequeFondo,
  projectDeudaMoraCHIP,
  projectDeudaMoraCC,
  projectDeudaMoraLeasing,
  projectDeudaMoraLSG,
  projectFinancialAccount
}