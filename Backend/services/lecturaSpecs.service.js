const axios = require('axios');
const cheerio = require('cheerio');

// Normaliza texto para comparar
function normalize(str) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Intenta convertir strings tipo "135 hp" a numero 135
function extractNumber(str) {
  const m = (str || '').match(/([0-9]+[\.,]?[0-9]*)/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}

exports.lookupSpecs = async ({ brand, model }) => {
  const q = encodeURIComponent(`${brand} ${model}`);
  const searchUrl = `https://www.lectura-specs.es/es/buscar?q=${q}`;

  // Resultado base
  const result = { source: 'lectura-specs', brand, model, url: null, specs: {} };

  // 1) Buscar lista de resultados
  const searchHtml = await axios.get(searchUrl, { timeout: 12000 }).then(r => r.data);
  const $s = cheerio.load(searchHtml);

  // Buscar enlaces a fichas; selector aproximado (puede cambiar)
  const links = [];
  $s('a').each((_, el) => {
    const href = $s(el).attr('href') || '';
    const text = $s(el).text();
    if (href.includes('/es/') && href.length < 300 && normalize(text).includes(normalize(model))) {
      links.push(new URL(href, 'https://www.lectura-specs.es').toString());
    }
  });

  if (links.length === 0) return result;

  // 2) Abrir el primer candidato
  const detailUrl = links[0];
  result.url = detailUrl;
  const html = await axios.get(detailUrl, { timeout: 12000 }).then(r => r.data);
  const $ = cheerio.load(html);

  // 3) Extraer pares clave:valor de tablas comunes
  const specs = {};
  $('table, .specs, .table').find('tr').each((_, tr) => {
    const tds = $(tr).find('td, th');
    if (tds.length >= 2) {
      const key = normalize($(tds[0]).text()).replace(/\s+/g, '_');
      const val = $(tds[1]).text().trim();
      if (key) specs[key] = val;
    }
  });

  // 4) Mapear a tus campos más comunes
  const mapped = {
    potencia_hp: extractNumber(specs['potencia'] || specs['potencia_del_motor'] || specs['potencia_maxima']) || null,
    traccion: (specs['traccion'] || specs['tipo_de_traccion'] || '').includes('4') ? 'Doble' : undefined,
    tipo_motor: specs['motor'] || specs['tipo_de_motor'] || undefined,
    cabina: (specs['cabina'] || '').toLowerCase().includes('si') ? 'Sí' : undefined,
  };

  result.specs = { raw: specs, mapped };
  return result;
};
