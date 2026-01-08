// Debug - verificar cálculos paso a paso
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
            const isr = rango.cuotaFija + (excedente * rango.tasa / 100);
            console.log('  Rango:', rango.limiteInf, '-', rango.limiteSup);
            console.log('  Excedente:', excedente.toFixed(2));
            console.log('  Cuota fija:', rango.cuotaFija);
            console.log('  Tasa:', rango.tasa + '%');
            return isr;
        }
    }
    return 0;
}

// Datos ICON como en el PDF del notario
const utilidadGravable = 3006818;
const numEnajenantes = 2;
const anios = 1;

console.log('=== DEBUG CALCULO ISR ===');
console.log('');
console.log('Utilidad Gravable:', utilidadGravable);
console.log('Num Enajenantes:', numEnajenantes);
console.log('Años:', anios);

const utilidadPorEnajenante = utilidadGravable / numEnajenantes;
console.log('');
console.log('Utilidad/Enajenante:', utilidadPorEnajenante.toFixed(2));

const utilidadAnual = utilidadPorEnajenante / anios;
console.log('Utilidad Anual:', utilidadAnual.toFixed(2));

console.log('');
console.log('Calculando ISR anual...');
const isrAnual = calcularISRTablas(utilidadAnual);
console.log('ISR Anual:', isrAnual.toFixed(2));

const isrPorEnajenante = isrAnual * anios;
console.log('ISR/Enajenante:', isrPorEnajenante.toFixed(2));

const isrTotal = isrPorEnajenante * numEnajenantes;
console.log('');
console.log('=== RESULTADO ===');
console.log('ISR Total:', isrTotal.toFixed(2));
console.log('Esperado:', 784272);
console.log('Diferencia:', (isrTotal - 784272).toFixed(2));
