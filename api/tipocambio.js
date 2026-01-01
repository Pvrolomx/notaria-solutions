// API Tipo de Cambio - Banxico
// Endpoint: /api/tipocambio

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache 1 hora
    
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    const BANXICO_TOKEN = '40418d20484c683fc7d603806b8bed5433e43ddba807b451b83cb2c09776c650';
    
    try {
        // SF43718 = Tipo de cambio FIX
        // SF63528 = Tipo de cambio para solventar obligaciones en moneda extranjera
        const response = await fetch(
            'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno',
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
        
        // Extraer el tipo de cambio
        const serie = data.bmx?.series?.[0];
        const dato = serie?.datos?.[0];
        
        if (!dato) {
            throw new Error('No data from Banxico');
        }
        
        const tipoCambio = parseFloat(dato.dato);
        const fecha = dato.fecha;
        
        // También obtener UDI
        const udiResponse = await fetch(
            'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SP68257/datos/oportuno',
            {
                headers: {
                    'Bmx-Token': BANXICO_TOKEN,
                    'Accept': 'application/json'
                }
            }
        );
        
        let valorUDI = 8.46; // Fallback
        let fechaUDI = '';
        
        if (udiResponse.ok) {
            const udiData = await udiResponse.json();
            const udiSerie = udiData.bmx?.series?.[0];
            const udiDato = udiSerie?.datos?.[0];
            if (udiDato) {
                valorUDI = parseFloat(udiDato.dato);
                fechaUDI = udiDato.fecha;
            }
        }
        
        // Calcular exención casa habitación
        const exencionUDIs = 700000;
        const exencionPesos = exencionUDIs * valorUDI;
        
        return res.status(200).json({
            success: true,
            fuente: 'Banxico',
            ultimaActualizacion: new Date().toISOString(),
            tipoCambio: {
                valor: tipoCambio,
                fecha: fecha,
                serie: 'SF43718',
                descripcion: 'Tipo de cambio FIX'
            },
            udi: {
                valor: valorUDI,
                fecha: fechaUDI,
                serie: 'SP68257',
                descripcion: 'Unidad de Inversión'
            },
            exencionCasaHabitacion: {
                udis: exencionUDIs,
                pesos: exencionPesos,
                dolares: exencionPesos / tipoCambio
            }
        });
        
    } catch (error) {
        console.error('Error fetching from Banxico:', error);
        
        // Fallback con valores aproximados
        const fallbackTC = 20.50;
        const fallbackUDI = 8.46;
        
        return res.status(200).json({
            success: true,
            fuente: 'Fallback (Banxico no disponible)',
            ultimaActualizacion: new Date().toISOString(),
            tipoCambio: {
                valor: fallbackTC,
                fecha: 'N/A',
                serie: 'SF43718',
                descripcion: 'Tipo de cambio FIX (estimado)'
            },
            udi: {
                valor: fallbackUDI,
                fecha: 'N/A',
                serie: 'SP68257',
                descripcion: 'UDI (estimado)'
            },
            exencionCasaHabitacion: {
                udis: 700000,
                pesos: 700000 * fallbackUDI,
                dolares: (700000 * fallbackUDI) / fallbackTC
            },
            warning: 'Usando valores de respaldo'
        });
    }
}
