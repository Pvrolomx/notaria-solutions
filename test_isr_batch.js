// Test ISR Batch - Corregido para multiples enajenantes
const EXENCION_UDIS = 700000;

const INPC = {
    '2020-08': 107.867,
    '2025-07': 140.405
};

const TABLAS_ISR = [
    { limiteInf: 0.01, limiteSup: 8952.49, cuotaFija: 0, tasa: 1.92 },
    { limiteInf: 8952.50, limiteSup: 75984.55, cuotaFija: 171.88, tasa: 6.40 },
    { limiteInf: 75984.56, limiteSup: 133536.07, cuotaFija: 4461.94, tasa: 10.88 },
    { limiteInf: 133536.08, limiteSup: 155229.80, cuotaFija: 10723.55, tasa: 16.00 },
    { limiteInf: 155229.81, limiteSup: 185852.57, cuotaFija: 14194.54, tasa: 17.92 },
    { limiteInf: 185852.58, limiteSup: 374837.88, cuotaFija: 19682.13, tasa: 21.36 },
    { limiteInf: 374837.89, limiteSup: 590795.99, cuotaFija: 60049.40, tasa: 23.52 },
    { limiteInf: 590796.00, limiteSup: 1127926.84, cuotaFija: 110842.74, tasa: 30.00 },
    { limiteInf: 1127926.85, limiteSup: 1503902.46, cuotaFija: 271981.99, tasa: 32.00 },
    { limiteInf: 1503902.47, limiteSup: 4511707.37, cuotaFija: 392294.17, tasa: 34.00 },
    { limiteInf: 4511707.38, limiteSup: Infinity, cuotaFija: 1414947.85, tasa: 35.00 }
];

function getINPC(fecha) {
    const d = new Date(fecha);
    const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
    return INPC[key] || 100;
}

function calcularISRTablas(utilidadAnual) {
    for (const rango of TABLAS_ISR) {
        if (utilidadAnual >= rango.limiteInf && utilidadAnual <= rango.limiteSup) {
            const excedente = utilidadAnual - rango.limiteInf;
            return rango.cuotaFija + (excedente * rango.tasa / 100);
        }
    }
    return 0;
}

function calcularISR(params) {
    const {
        fechaVenta, fechaCompra, precioVenta, precioCompra,
        pctTerreno = 20, pctConst = 80,
        numEnajenantes = 1, numExentan = 0,
        aplicaExencion = false, comision = 0, udiValor = 8.510419
    } = params;
    
    // Años
    const dV = new Date(fechaVenta), dC = new Date(fechaCompra);
    let anios = Math.floor((dV - dC) / (365.25 * 24 * 60 * 60 * 1000));
    anios = Math.max(1, Math.min(anios, 20));
    
    // INPC
    const inpcV = getINPC(fechaVenta), inpcC = getINPC(fechaCompra);
    const factor = inpcV / inpcC;
    
    // Exencion (aplica al precio de venta)
    let pctGravable = 1;
    let exencionTotal = 0;
    if (aplicaExencion && numExentan > 0) {
        exencionTotal = EXENCION_UDIS * udiValor * numExentan;
        if (precioVenta > exencionTotal) {
            pctGravable = (precioVenta - exencionTotal) / precioVenta;
        } else {
            pctGravable = 0;
        }
    }
    
    // Precios ajustados por exencion
    const precioVentaAjust = precioVenta * pctGravable;
    const precioCompraAjust = precioCompra * pctGravable;
    const comisionAjust = comision * pctGravable;
    
    // Deducciones actualizadas
    const terrenoAct = precioCompraAjust * (pctTerreno/100) * factor;
    const pctDeprec = Math.min(anios * 3, 80) / 100;
    const constDepreciada = precioCompraAjust * (pctConst/100) * (1 - pctDeprec);
    const constAct = constDepreciada * factor;
    const totalDeduc = terrenoAct + constAct + comisionAjust;
    
    // Utilidad TOTAL
    const utilidadTotal = Math.max(0, precioVentaAjust - totalDeduc);
    
    // ISR POR ENAJENANTE (cada uno calcula su parte)
    const utilidadPorEnajenante = utilidadTotal / numEnajenantes;
    const utilidadAnualPorEnajenante = utilidadPorEnajenante / anios;
    
    const isrAnualPorEnajenante = calcularISRTablas(utilidadAnualPorEnajenante);
    const isrTotalPorEnajenante = isrAnualPorEnajenante * anios;
    
    // ISR Estado (5% de utilidad, max ISR total)
    const isrEstadoPorEnajenante = Math.min(utilidadPorEnajenante * 0.05, isrTotalPorEnajenante);
    const isrFedPorEnajenante = isrTotalPorEnajenante - isrEstadoPorEnajenante;
    
    // TOTALES (suma de todos los enajenantes)
    const isrTotal = isrTotalPorEnajenante * numEnajenantes;
    const isrEstado = isrEstadoPorEnajenante * numEnajenantes;
    const isrFed = isrFedPorEnajenante * numEnajenantes;
    
    return {
        anios,
        factor: factor.toFixed(4),
        pctGravable: (pctGravable * 100).toFixed(2) + '%',
        exencionTotal: exencionTotal.toFixed(2),
        terrenoAct: terrenoAct.toFixed(2),
        constAct: constAct.toFixed(2),
        totalDeduc: totalDeduc.toFixed(2),
        utilidadTotal: utilidadTotal.toFixed(2),
        utilidadPorEnajenante: utilidadPorEnajenante.toFixed(2),
        utilidadAnualPorEnajenante: utilidadAnualPorEnajenante.toFixed(2),
        isrAnualPorEnajenante: isrAnualPorEnajenante.toFixed(2),
        isrTotalPorEnajenante: isrTotalPorEnajenante.toFixed(2),
        isrTotal: isrTotal.toFixed(2),
        isrEstado: isrEstado.toFixed(2),
        isrFed: isrFed.toFixed(2)
    };
}

// === CASO CAMPANARIO ===
const campanario = {
    fechaVenta: '2025-07-14',
    fechaCompra: '2020-08-25',
    precioVenta: 15938350,
    precioCompra: 8451500,
    pctTerreno: 20,
    pctConst: 80,
    numEnajenantes: 2,
    numExentan: 2,
    aplicaExencion: true,
    comision: 15938350 * 0.06,
    udiValor: 8.510419
};

console.log('=== TEST ISR CAMPANARIO ===\\n');
const r = calcularISR(campanario);
console.log('Años:', r.anios);
console.log('Factor INPC:', r.factor);
console.log('% Gravable:', r.pctGravable);
console.log('Exención:', r.exencionTotal);
console.log('\\nDeducciones:');
console.log('  Terreno Act:', r.terrenoAct);
console.log('  Const Act:', r.constAct);
console.log('  Total Deduc:', r.totalDeduc);
console.log('\\nUtilidad Total:', r.utilidadTotal);
console.log('Utilidad/Enajenante:', r.utilidadPorEnajenante);
console.log('Utilidad Anual/Enajenante:', r.utilidadAnualPorEnajenante);
console.log('\\nISR Anual/Enajenante:', r.isrAnualPorEnajenante);
console.log('ISR Total/Enajenante:', r.isrTotalPorEnajenante);
console.log('\\n=== RESULTADO FINAL ===');
console.log('ISR Total:', r.isrTotal);
console.log('ISR Estado:', r.isrEstado);
console.log('ISR Fed:', r.isrFed);
console.log('\\n=== ESPERADO (Documento) ===');
console.log('ISR Total: 118,956.10');
console.log('ISR Estado: 63,598.56');
console.log('ISR Fed: 55,357.54');
