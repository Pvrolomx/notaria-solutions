// Test ISR - Caso 3b: 2 enajenantes
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

// === DATOS CON 2 ENAJENANTES ===
const utilidadTotal = 3006818;  // Del documento
const numEnajenantes = 2;
const anios = 1;

// Por enajenante
const utilidadPorEnajenante = utilidadTotal / numEnajenantes;  // 1,503,409
const utilidadAnual = utilidadPorEnajenante / anios;  // 1,503,409

console.log('=== CASO 3b: 2 ENAJENANTES ===');
console.log('');
console.log('Utilidad Total:', utilidadTotal);
console.log('Utilidad/Enajenante:', utilidadPorEnajenante);
console.log('Utilidad Anual:', utilidadAnual);

// ISR por enajenante
const isrAnual = calcularISRTablas(utilidadAnual);
const isrPorEnajenante = Math.round(isrAnual * anios);
const isrEstadoPorEnaj = Math.round(Math.min(utilidadPorEnajenante * 0.05, isrPorEnajenante));
const isrFedPorEnaj = isrPorEnajenante - isrEstadoPorEnaj;

console.log('');
console.log('ISR/Enajenante:', isrPorEnajenante);
console.log('Estado/Enajenante:', isrEstadoPorEnaj);
console.log('Fed/Enajenante:', isrFedPorEnaj);

// Total
const isrTotal = isrPorEnajenante * numEnajenantes;
const isrEstado = isrEstadoPorEnaj * numEnajenantes;
const isrFed = isrFedPorEnaj * numEnajenantes;

console.log('');
console.log('=== MI RESULTADO ===');
console.log('ISR Total:', isrTotal);
console.log('ISR Estado:', isrEstado);
console.log('ISR Federal:', isrFed);
console.log('');
console.log('=== NOTARIO ===');
console.log('ISR Total: 784,272');
console.log('ISR Estado: 150,340');
console.log('ISR Fed: 633,932');
