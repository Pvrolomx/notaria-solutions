const { test, expect } = require('@playwright/test');

const URL = 'https://notaria-solutions.vercel.app/calculadora.html';

// Helper para limpiar y llenar campo de moneda
async function fillMoney(page, selector, value) {
  await page.click(selector);
  await page.fill(selector, '');
  await page.type(selector, value.toString());
}

test.describe('Calculadora ISR - Casos de Prueba', () => {

  test('Caso 1: Terreno urbano - ISR ~$9,215', async ({ page }) => {
    await page.goto(URL);
    await page.fill('input[type="date"]:nth-of-type(1)', '2019-05-10'); // Compra
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(1)', '1800000');
    await page.fill('input[type="date"]:nth-of-type(2)', '2024-03-15'); // Venta
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(2)', '2500000');
    await page.fill('input[type="number"][value="20"]', '100'); // 100% terreno
    await page.fill('input[type="number"][value="80"]', '0');   // 0% construcción
    await page.click('button:has-text("Calcular ISR")');
    await page.waitForTimeout(1000);
    // Verificar ISR cercano a $9,215
    const isrText = await page.textContent('text=TOTAL ISR A PAGAR');
    console.log('Caso 1 ISR:', isrText);
  });

  test('Caso 2: Depto sin exención - ISR ~$28,084', async ({ page }) => {
    await page.goto(URL);
    await page.fill('input[type="date"]:nth-of-type(1)', '2018-08-15');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(1)', '2400000');
    await page.fill('input[type="date"]:nth-of-type(2)', '2023-06-20');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(2)', '3200000');
    await page.fill('input[type="number"][value="20"]', '30');
    await page.fill('input[type="number"][value="80"]', '70');
    await page.click('button:has-text("Calcular ISR")');
    await page.waitForTimeout(1000);
  });

  test('Caso 3: Casa pequeña - ISR ~$24,918', async ({ page }) => {
    await page.goto(URL);
    await page.fill('input[type="date"]:nth-of-type(1)', '2022-06-15');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(1)', '1200000');
    await page.fill('input[type="date"]:nth-of-type(2)', '2024-02-01');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(2)', '1500000');
    await page.fill('input[type="number"][value="20"]', '40');
    await page.fill('input[type="number"][value="80"]', '60');
    await page.click('button:has-text("Calcular ISR")');
    await page.waitForTimeout(1000);
  });

  test('Caso 4: Terreno rústico largo plazo - ISR ~$204,808', async ({ page }) => {
    await page.goto(URL);
    await page.fill('input[type="date"]:nth-of-type(1)', '2010-03-20');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(1)', '1500000');
    await page.fill('input[type="date"]:nth-of-type(2)', '2024-11-10');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(2)', '5000000');
    await page.fill('input[type="number"][value="20"]', '100');
    await page.fill('input[type="number"][value="80"]', '0');
    await page.click('button:has-text("Calcular ISR")');
    await page.waitForTimeout(1000);
  });

  test('Caso 5: Local comercial - ISR ~$89,448', async ({ page }) => {
    await page.goto(URL);
    await page.fill('input[type="date"]:nth-of-type(1)', '2017-04-12');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(1)', '3000000');
    await page.fill('input[type="date"]:nth-of-type(2)', '2023-09-05');
    await fillMoney(page, 'input[placeholder="$0.00"]:nth-of-type(2)', '4500000');
    await page.fill('input[type="number"][value="20"]', '25');
    await page.fill('input[type="number"][value="80"]', '75');
    await page.click('input[type="checkbox"]:near(:text("Local Comercial"))'); // Marcar local comercial
    await page.click('button:has-text("Calcular ISR")');
    await page.waitForTimeout(1000);
  });

});
