// Vercel Serverless Function - INPC Proxy
// Endpoint: /api/inpc

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const TOKEN = process.env.INEGI_TOKEN || 'f9caa992-203b-4f7b-999d-57b53d40c3ed';
        const INDICADOR = '628194';
        const url = `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/${INDICADOR}/es/0700/false/BIE/2.0/${TOKEN}?type=json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error INEGI: ' + response.status);
        }
        
        const data = await response.json();
        const observations = data?.Series?.[0]?.OBSERVATIONS || [];
        
        const inpc = {};
        observations.forEach(obs => {
            const fecha = obs.TIME_PERIOD;
            const valor = parseFloat(obs.OBS_VALUE);
            const [year, month] = fecha.split('/');
            const key = `${year}-${month.padStart(2, '0')}`;
            inpc[key] = valor;
        });
        
        const porAnio = {};
        observations.forEach(obs => {
            const [year] = obs.TIME_PERIOD.split('/');
            const valor = parseFloat(obs.OBS_VALUE);
            if (!porAnio[year]) {
                porAnio[year] = { sum: 0, count: 0 };
            }
            porAnio[year].sum += valor;
            porAnio[year].count++;
        });
        
        const inpcAnual = {};
        Object.keys(porAnio).forEach(year => {
            inpcAnual[year] = Math.round((porAnio[year].sum / porAnio[year].count) * 100) / 100;
        });
        
        return res.status(200).json({
            success: true,
            fuente: 'INEGI',
            ultimaActualizacion: new Date().toISOString(),
            mensual: inpc,
            anual: inpcAnual
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(200).json({
            success: false,
            error: error.message,
            fuente: 'Fallback',
            anual: {
                '2015': 87.5, '2016': 90.4, '2017': 94.5, '2018': 98.0, '2019': 101.5,
                '2020': 104.5, '2021': 109.5, '2022': 117.5, '2023': 124.0, '2024': 131.0, '2025': 141.0
            }
        });
    }
}
