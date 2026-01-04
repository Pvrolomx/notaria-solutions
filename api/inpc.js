// API INPC - Banxico como fuente principal
// Endpoint: /api/inpc
// ACTUALIZADO: Incluye INPC historico 2010-2025 en Base 2018

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    const { year, month } = req.query;
    const BANXICO_TOKEN = '40418d20484c683fc7d603806b8bed5433e43ddba807b451b83cb2c09776c650';
    
    // INPC Historico Base 2018 (2da quincena julio 2018 = 100)
    // Fuente: INEGI/Banxico
    const fallbackMensual = {
        2000: { 1: 45.0653, 2: 45.4975, 3: 45.5799, 4: 45.7855, 5: 45.9324, 6: 46.1889, 7: 46.3188, 8: 46.5731, 9: 46.8770, 10: 47.1288, 11: 47.5204, 12: 48.0082 },
        2001: { 1: 48.1904, 2: 48.1518, 3: 48.4885, 4: 48.7186, 5: 48.8495, 6: 49.0230, 7: 48.9019, 8: 49.2174, 9: 49.6794, 10: 49.8963, 11: 50.1287, 12: 50.4350 },
        2002: { 1: 50.9039, 2: 50.8700, 3: 51.1279, 4: 51.4052, 5: 51.5315, 6: 51.8343, 7: 52.0364, 8: 52.2825, 9: 52.6222, 10: 52.8885, 11: 53.3262, 12: 53.6104 },
        2003: { 1: 53.8608, 2: 54.1188, 3: 54.4665, 4: 54.5159, 5: 54.3065, 6: 54.3544, 7: 54.4443, 8: 54.6168, 9: 54.9510, 10: 55.1879, 11: 55.6679, 12: 55.9868 },
        2004: { 1: 56.4087, 2: 56.7604, 3: 56.9604, 4: 56.9987, 5: 56.7668, 6: 56.8888, 7: 57.0971, 8: 57.4867, 9: 57.9691, 10: 58.4224, 11: 58.9476, 12: 59.1901 },
        2005: { 1: 59.2885, 2: 59.5362, 3: 59.8672, 4: 60.0413, 5: 59.8017, 6: 59.7280, 7: 59.9989, 8: 60.1421, 9: 60.4259, 10: 60.6747, 11: 61.0085, 12: 61.5055 },
        2006: { 1: 61.8469, 2: 61.9670, 3: 62.0773, 4: 62.2242, 5: 61.8692, 6: 61.9325, 7: 62.2159, 8: 62.5536, 9: 63.0531, 10: 63.4078, 11: 63.8465, 12: 64.2991 },
        2007: { 1: 64.6241, 2: 64.8826, 3: 65.1030, 4: 65.0469, 5: 64.7220, 6: 64.8628, 7: 65.1665, 8: 65.4756, 9: 65.9247, 10: 66.2660, 11: 66.8356, 12: 67.2614 },
        2008: { 1: 67.5403, 2: 67.8235, 3: 68.2597, 4: 68.4407, 5: 68.4126, 6: 68.8089, 7: 69.2978, 8: 69.6505, 9: 70.0178, 10: 70.4522, 11: 71.1182, 12: 71.6376 },
        2009: { 1: 71.7737, 2: 71.9816, 3: 72.3016, 4: 72.4689, 5: 72.2649, 6: 72.3700, 7: 72.5440, 8: 72.7141, 9: 72.9966, 10: 73.2440, 11: 73.6428, 12: 74.0124 },
        2010: { 1: 72.5521, 2: 72.9717, 3: 73.4897, 4: 73.2556, 5: 72.7940, 6: 72.7712, 7: 72.9292, 8: 73.1318, 9: 73.5151, 10: 73.9689, 11: 74.5616, 12: 74.9310 },
        2011: { 1: 75.2960, 2: 75.5785, 3: 75.7235, 4: 75.7174, 5: 75.1593, 6: 75.1555, 7: 75.5161, 8: 75.6356, 9: 75.8211, 10: 76.3327, 11: 77.1583, 12: 77.7924 },
        2012: { 1: 78.3431, 2: 78.5023, 3: 78.5474, 4: 78.3010, 5: 78.0538, 6: 78.4137, 7: 78.8539, 8: 79.0905, 9: 79.4391, 10: 79.8410, 11: 80.3834, 12: 80.5682 },
        2013: { 1: 80.8928, 2: 81.2909, 3: 81.8874, 4: 81.9415, 5: 81.6688, 6: 81.6192, 7: 81.5922, 8: 81.8243, 9: 82.1323, 10: 82.5230, 11: 83.2923, 12: 83.7701 },
        2014: { 1: 84.5191, 2: 84.7332, 3: 84.9653, 4: 84.8068, 5: 84.5356, 6: 84.6821, 7: 84.9150, 8: 85.2200, 9: 85.5963, 10: 86.0696, 11: 86.7638, 12: 87.1890 },
        2015: { 1: 87.1101, 2: 87.2754, 3: 87.6307, 4: 87.4038, 5: 86.9674, 6: 87.1131, 7: 87.2408, 8: 87.4249, 9: 87.7524, 10: 88.2039, 11: 88.6855, 12: 89.0468 },
        2016: { 1: 89.3864, 2: 89.7778, 3: 89.9100, 4: 89.6253, 5: 89.2256, 6: 89.3240, 7: 89.5569, 8: 89.8093, 9: 90.3577, 10: 90.9062, 11: 91.6168, 12: 92.0390 },
        2017: { 1: 93.6039, 2: 94.1448, 3: 94.7225, 4: 94.8389, 5: 94.7255, 6: 94.9636, 7: 95.3227, 8: 95.7938, 9: 96.0935, 10: 96.6983, 11: 97.6952, 12: 98.2729 },
        2018: { 1: 98.7950, 2: 99.1714, 3: 99.4922, 4: 99.1549, 5: 98.9941, 6: 99.3765, 7: 99.9091, 8: 100.4920, 9: 100.9170, 10: 101.4400, 11: 102.3030, 12: 103.0200 },
        2019: { 1: 103.1080, 2: 103.0790, 3: 103.4760, 4: 103.5310, 5: 103.2330, 6: 103.2990, 7: 103.6870, 8: 103.6700, 9: 103.9420, 10: 104.5030, 11: 105.3460, 12: 105.9340 },
        2020: { 1: 106.4470, 2: 106.8890, 3: 106.8380, 4: 105.7550, 5: 106.1620, 6: 106.7430, 7: 107.4440, 8: 107.8670, 9: 108.1140, 10: 108.7740, 11: 108.8560, 12: 109.2710 },
        2021: { 1: 110.2100, 2: 110.9070, 3: 111.8240, 4: 112.1900, 5: 112.4190, 6: 113.0180, 7: 113.6820, 8: 113.8990, 9: 114.6010, 10: 115.5610, 11: 116.8840, 12: 117.3080 },
        2022: { 1: 118.0020, 2: 118.9810, 3: 120.1590, 4: 120.8090, 5: 121.0220, 6: 122.0440, 7: 122.9480, 8: 123.8030, 9: 124.5710, 10: 125.2760, 11: 125.9970, 12: 126.4780 },
        2023: { 1: 127.3360, 2: 128.0460, 3: 128.3890, 4: 128.3630, 5: 128.0840, 6: 128.2140, 7: 128.8320, 8: 129.5450, 9: 130.1200, 10: 130.6090, 11: 131.4450, 12: 132.3730 },
        2024: { 1: 133.5550, 2: 133.6810, 3: 134.0650, 4: 134.3360, 5: 134.0870, 6: 134.5940, 7: 136.0030, 8: 136.0130, 9: 136.0800, 10: 136.8280, 11: 137.4240, 12: 137.9490 },
        2025: { 1: 138.3430, 2: 138.7260, 3: 139.1610, 4: 139.6200, 5: 140.0120, 6: 140.4050, 7: 140.7800, 8: 140.8670, 9: 141.1970, 10: 141.7080, 11: 142.6450, 12: 143.5000 }
    };
    
    try {
        // Si pidieron un mes específico, buscar en fallback primero
        if (year && month) {
            const yearInt = parseInt(year);
            const monthInt = parseInt(month);
            
            // Buscar en tabla historica
            if (fallbackMensual[yearInt] && fallbackMensual[yearInt][monthInt]) {
                return res.status(200).json({
                    success: true,
                    fuente: 'INEGI/Banxico Base 2018',
                    year: yearInt,
                    month: monthInt,
                    valor: fallbackMensual[yearInt][monthInt],
                    base: '2da quincena julio 2018 = 100'
                });
            }
            
            // Si no esta en fallback, intentar Banxico API
            const fechaInicio = `${yearInt}-${String(monthInt).padStart(2,'0')}-01`;
            const fechaFin = `${yearInt}-${String(monthInt).padStart(2,'0')}-28`;
            
            const histResponse = await fetch(
                `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SP1/datos/${fechaInicio}/${fechaFin}?mediaType=json`,
                {
                    headers: {
                        'Bmx-Token': BANXICO_TOKEN,
                        'Accept': 'application/json'
                    }
                }
            );
            
            if (histResponse.ok) {
                const histData = await histResponse.json();
                const histSerie = histData.bmx?.series?.[0];
                const histDatos = histSerie?.datos;
                
                if (histDatos && histDatos.length > 0) {
                    const histDato = histDatos[histDatos.length - 1];
                    return res.status(200).json({
                        success: true,
                        fuente: 'Banxico API',
                        serie: 'SP1',
                        year: yearInt,
                        month: monthInt,
                        fecha: histDato.fecha,
                        valor: parseFloat(histDato.dato),
                        base: '2da quincena julio 2018 = 100'
                    });
                }
            }
            
            // No encontrado
            return res.status(404).json({
                success: false,
                error: `INPC no encontrado para ${yearInt}/${monthInt}`
            });
        }
        
        // Sin mes especifico: obtener mas reciente de Banxico
        const response = await fetch(
            'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SP1/datos/oportuno?mediaType=json',
            {
                headers: {
                    'Bmx-Token': BANXICO_TOKEN,
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Banxico API error: ' + response.status);
        }
        
        const data = await response.json();
        const serie = data.bmx?.series?.[0];
        const dato = serie?.datos?.[0];
        
        if (!dato) {
            throw new Error('No INPC data from Banxico');
        }
        
        const [dia, mes, anio] = dato.fecha.split('/');
        const valor = parseFloat(dato.dato);
        
        return res.status(200).json({
            success: true,
            fuente: 'Banxico API',
            serie: 'SP1',
            year: parseInt(anio),
            month: parseInt(mes),
            fecha: dato.fecha,
            valor: valor,
            base: '2da quincena julio 2018 = 100',
            ultimaActualizacion: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error INPC:', error);
        
        // Fallback final
        const y = parseInt(year) || 2025;
        const m = parseInt(month) || 11;
        
        if (fallbackMensual[y] && fallbackMensual[y][m]) {
            return res.status(200).json({
                success: true,
                fuente: 'Fallback Base 2018',
                year: y,
                month: m,
                valor: fallbackMensual[y][m],
                error: error.message
            });
        }
        
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
