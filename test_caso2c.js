// Test ISR - Caso 2c: INPC CORRECTO
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

function calcularISRTablas(utilidadAnual) {
    for (const rango of TABLAS_ISR) {
        if (utilidadAnual >= rango.limiteInf && utilidadAnual <= rango.limiteSup) {
            const excedente = utilidadAnual - rango.limiteInf;
            return rango.cuotaFija + (excedente * rango.tasa / 100);
        }
    }
    return 0;
}

// === DATOS (Valores de Nuvigant) ===
const precioVenta = 8645000;
const precioCompra = 3364051.81;
const pctTerreno = 20;
const pctConst = 80;
const numEnajenantes = 1;
const comision = 518700;  // 6%
const anios = 7;

// INPC de Nuvigant
const inpcVenta = 142.6450;
const inpcCompra = 99.3765;
const factor = inpcVenta / inpcCompra;

console.log('=== CASO 2c: VALORES NUVIGANT ===');
console.log('');
console.log('INPC Venta:', inpcVenta);
console.log('INPC Compra:', inpcCompra);
console.log('Factor:', factor.toFixed(4));
console.log('Años:', anios);

// Deducciones
const terrenoAct = precioCompra * (pctTerreno/100) * factor;
const pctDeprec = anios * 3 / 100;  // 21%
const constDepreciada = precioCompra * (pctConst/100) * (1 - pctDeprec);
const constAct = constDepreciada * factor;
const totalDeduc = terrenoAct + constAct + comision;

console.log('');
console.log('Terreno Act:', terrenoAct.toFixed(2));
console.log('Const Depreciada:', constDepreciada.toFixed(2));
console.log('Const Act:', constAct.toFixed(2));
console.log('Comision:', comision);
console.log('Total Deducciones:', totalDeduc.toFixed(2));

// Utilidad
const utilidadTotal = precioVenta - totalDeduc;
const utilidadAnual = utilidadTotal / anios;

console.log('');
console.log('Utilidad Total:', utilidadTotal.toFixed(2));
console.log('Utilidad Anual:', utilidadAnual.toFixed(2));

// ISR
const isrAnual = calcularISRTablas(utilidadAnual);
const isrTotal = Math.round(isrAnual * anios);
const isrEstado = Math.round(Math.min(utilidadTotal * 0.05, isrTotal));
const isrFed = isrTotal - isrEstado;

console.log('');
console.log('ISR Anual:', isrAnual.toFixed(2));
console.log('');
console.log('=== MI RESULTADO ===');
console.log('ISR Total:', isrTotal);
console.log('ISR Estado:', isrEstado);
console.log('ISR Federal:', isrFed);
console.log('');
console.log('=== NUVIGANT ===');
console.log('ISR Total: 769,596');
console.log('ISR Estado: 205,439');
console.log('ISR Fed: 564,157');
