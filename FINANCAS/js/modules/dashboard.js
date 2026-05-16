function calculateMonthStats(month, year) {
    let inc = 0, expPaid = 0, expPend = 0;
    transactions.filter(t => t.month === month && t.year === year).forEach(t => {
        if (t.type === 'income' && t.status === 'paid') inc += t.amount;
        if (t.type === 'expense') {
            if (t.status === 'paid') expPaid += t.amount;
            else expPend += t.amount;
        }
    });
    return { inc, expPaid, expPend, balance: inc - expPaid };
}

function updateTrend(elementId, current, previous, invert = false) {
    const el = document.getElementById(elementId);
    if(previous === 0) { el.innerHTML = ''; return; }
    
    const diff = ((current - previous) / previous) * 100;
    const absDiff = Math.abs(diff).toFixed(1);
    let isGood = invert ? diff <= 0 : diff >= 0;
    let icon = diff >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
    let colorClass = isGood ? 'text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md' : 'text-red-500 bg-red-50 px-2 py-0.5 rounded-md';
    let verb = diff >= 0 ? '+' : '-';
    
    el.innerHTML = `<span class="${colorClass}"><i class="fa-solid ${icon} mr-1"></i> ${verb}${absDiff}%</span> <span class="text-slate-400 font-normal ml-1">vs mês anterior</span>`;
}

function renderDashboardChart(rec, des, pend) {
    const ctx = document.getElementById('dashboardChart');
    if (dashChartInstance) dashChartInstance.destroy();

    const gradRec = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradRec.addColorStop(0, 'rgba(16, 185, 129, 0.8)'); gradRec.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
    
    const gradDes = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradDes.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); gradDes.addColorStop(1, 'rgba(239, 68, 68, 0.2)');

    dashChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Este Mês'],
            datasets: [
                { label: 'Receitas', data: [rec], backgroundColor: gradRec, borderRadius: 8, barPercentage: 0.6 },
                { label: 'Despesas Pagas', data: [des], backgroundColor: gradDes, borderRadius: 8, barPercentage: 0.6 },
                { label: 'Pendentes', data: [pend], backgroundColor: '#fcd34d', borderRadius: 8, barPercentage: 0.6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 } },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f1f5f9' }, border: { display: false } },
                x: { grid: { display: false }, border: { display: false } }
            }
        }
    });
}