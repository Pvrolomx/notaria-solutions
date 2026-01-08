// Test ISR - Caso 2b: 1 enajenante, 6% comision
const INPC = {
    '2018-06': 99.3765,
    '2026-01': 142.6450
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

// === DATOS CORREGIDOS ===
const precioVenta = 8645000;
const precioCompra = 3364051.81;
const fechaVenta = '2026-01-01';
const fechaCompra = '2018-06-19';
const pctTerreno = 20;
const pctConst = 80;
const numEnajenantes = 1;  // CORREGIDO
const comision = precioVenta * 0.06;  // CORREGIDO: 6%

// Años
const dV = new Date(fechaVenta), dC = new Date(fechaCompra);
let anios = Math.floor((dV - dC) / (365.25 * 24 * 60 * 60 * 1000));
anios = Math.max(1, Math.min(anios, 20));

// INPC
const inpcV = getINPC(fechaVenta), inpcC = getINPC(fechaCompra);
const factor = inpcV / inpcC;

console.log('=== CASO 2b: 1 ENAJENANTE, 6% COMISION ===');
console.log('');
console.log('Precio Venta:', precioVenta.toLocaleString());
console.log('Precio Compra:', precioCompra.toLocaleString());
console.log('Comision 6%:', comision.toLocaleString());
console.log('Años:', anios);
console.log('INPC Venta:', inpcV, '/ Compra:', inpcC);
console.log('Factor:', factor.toFixed(4));

// Deducciones
const terrenoAct = precioCompra * (pctTerreno/100) * factor;
const pctDeprec = Math.min(anios * 3, 80) / 100;
const constDepreciada = precioCompra * (pctConst/100) * (1 - pctDeprec);
const constAct = constDepreciada * factor;
const totalDeduc = terrenoAct + constAct + comision;

console.log('');
console.log('Depreciacion:', (pctDeprec*100) + '%');
console.log('Terreno Act:', terrenoAct.toFixed(2));
console.log('Const Depreciada:', constDepreciada.toFixed(2));
console.log('Const Act:', constAct.toFixed(2));
console.log('Total Deducciones:', totalDeduc.toFixed(2));

// Utilidad
const utilidadTotal = Math.max(0, precioVenta - totalDeduc);
const utilidadAnual = utilidadTotal / anios;

console.log('');
console.log('Utilidad Total:', utilidadTotal.toFixed(2));
console.log('Utilidad Anual:', utilidadAnual.toFixed(2));

// ISR
const isrAnual = calcularISRTablas(utilidadAnual);
const isrTotal = isrAnual * anios;
const isrEstado = Math.min(utilidadTotal * 0.05, isrTotal);
const isrFed = isrTotal - isrEstado;

console.log('');
console.log('ISR Anual:', isrAnual.toFixed(2));
console.log('');
console.log('=== MI RESULTADO ===');
console.log('ISR Total:', isrTotal.toFixed(2));
console.log('ISR Estado:', isrEstado.toFixed(2));
console.log('ISR Federal:', isrFed.toFixed(2));
console.log('');
console.log('=== NUVIGANT (esperado) ===');
console.log('ISR Total: 769,596.00');
console.log('ISR Estado: 205,439.00');
console.log('ISR Fed: 564,157.00');
