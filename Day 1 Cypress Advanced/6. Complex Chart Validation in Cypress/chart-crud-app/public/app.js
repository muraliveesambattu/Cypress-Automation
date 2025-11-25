const API_URL = '/api/sales';

let salesData = [];
let chartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  loadSales();

  const form = document.getElementById('sales-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const label = document.getElementById('label-input').value;
    const amount = Number(document.getElementById('amount-input').value);

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, amount })
    });

    document.getElementById('label-input').value = '';
    document.getElementById('amount-input').value = '';

    loadSales();
  });
});

async function loadSales() {
  const res = await fetch(API_URL);
  salesData = await res.json();
  renderTable();
  renderCanvasChart();
  renderSvgChart();
}

function renderTable() {
  const tbody = document.querySelector('#sales-table tbody');
  tbody.innerHTML = '';
  salesData.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.label}</td>
      <td>${s.amount}</td>
    `;
    tbody.appendChild(tr);
  });
}

/** Canvas chart using Chart.js */
function renderCanvasChart() {
  const ctx = document.getElementById('salesCanvas').getContext('2d');

  const labels = salesData.map(s => s.label);
  const amounts = salesData.map(s => s.amount);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Sales Amount',
        data: amounts
      }]
    },
    options: {
      responsive: false,
      animation: false
    }
  });

  // Expose for Cypress (we'll use this)
  window.salesChart = chartInstance;
}

/** SVG chart (simple hand-drawn bar chart) */
function renderSvgChart() {
  const svg = document.getElementById('salesSvg');
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');
  svg.innerHTML = ''; // clear old

  const maxAmount = Math.max(...salesData.map(s => s.amount), 0) || 1;
  const barWidth = (width - 40) / salesData.length; // padding 20 on each side

  salesData.forEach((s, index) => {
    const barHeight = (s.amount / maxAmount) * (height - 40); // top & bottom padding 20
    const x = 20 + index * barWidth;
    const y = height - 20 - barHeight;

    // Rect bar
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'bar');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth - 10);
    rect.setAttribute('height', barHeight);
    svg.appendChild(rect);

    // Label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + (barWidth - 10) / 2);
    text.setAttribute('y', height - 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.textContent = s.label;
    svg.appendChild(text);
  });
}
