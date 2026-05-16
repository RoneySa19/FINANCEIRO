function calcRetirement() {
    const aporte = parseFloat(document.getElementById('sAporte').value) || 0;
    const taxaAnual = parseFloat(document.getElementById('sTaxa').value) || 0;
    const idadeAtual = parseInt(document.getElementById('sIdade').value) || 0;
    const idadeApos = parseInt(document.getElementById('sAposentadoria').value) || 0;

    const anos = idadeApos - idadeAtual;
    if (anos <= 0) {
        document.getElementById('sResultado').innerText = "R$ 0,00";
        if(retChartInstance) retChartInstance.destroy();
        return;
    }

    const taxaMensal = (taxaAnual / 100) / 12;
    let dataPoints = []; let labels = []; let montante = 0;

    for (let i = 1; i <= anos; i++) {
        montante = aporte * ((Math.pow(1 + taxaMensal, i * 12) - 1) / taxaMensal);
        dataPoints.push(montante);
        labels.push(`Aos ${idadeAtual + i}`);
    }

    document.getElementById('sResultado').innerText = formatMoney(montante);
    renderRetirementChart(labels, dataPoints);
}

function renderRetirementChart(labels, data) {
    const ctx = document.getElementById('retirementChart');
    if (retChartInstance) retChartInstance.destroy();

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(167, 139, 250, 0.5)');
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0.0)');

    retChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Acumulado (R$)', data: data,
                borderColor: '#a78bfa', backgroundColor: gradient,
                borderWidth: 3, fill: true, tension: 0.4,
                pointBackgroundColor: '#fff', pointBorderColor: '#a78bfa', pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: {
                y: { display: false },
                x: { grid: { display: false, color: 'rgba(255,255,255,0.1)' }, border: { display: false }, ticks: { color: 'rgba(148, 163, 184, 0.7)' } }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false }
        }
    });
}