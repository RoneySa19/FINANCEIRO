function setGreeting() {
    const hour = new Date().getHours();
    let msg = "Olá, bem-vindo!";
    if (hour >= 5 && hour < 12) msg = "Bom dia, vamos controlar as finanças?";
    else if (hour >= 12 && hour < 18) msg = "Boa tarde! Como estão os gastos hoje?";
    else msg = "Boa noite! Hora de fechar as contas.";
    document.getElementById('greetingText').innerText = msg;
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
    document.getElementById('overlay').classList.toggle('hidden');
}

function switchTab(tabId, btn) {
    ['dashboard', 'lancamentos', 'simulador', 'metas'].forEach(id => {
        document.getElementById(id).classList.add('section-hidden');
    });
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('tab-active'));
    
    document.getElementById(tabId).classList.remove('section-hidden');
    if(btn) btn.classList.add('tab-active');

    const titles = { 'dashboard': 'Visão Geral', 'lancamentos': 'Lançamentos', 'simulador': 'Independência Financeira', 'metas': 'Metas e Poupanças' };
    document.getElementById('pageTitle').innerText = titles[tabId];

    if(window.innerWidth < 768) toggleMenu();
    updateUI(); 
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    updateUI();
}

function updateUI() {
    document.getElementById('currentMonthDisplay').innerText = `${monthNames[currentMonth]} ${currentYear}`;
    
    const currentStats = calculateMonthStats(currentMonth, currentYear);
    
    let prevMonth = currentMonth - 1; let prevYear = currentYear;
    if(prevMonth < 0) { prevMonth = 11; prevYear--; }
    const prevStats = calculateMonthStats(prevMonth, prevYear);

    document.getElementById('dashSaldo').innerText = formatMoney(currentStats.balance);
    document.getElementById('dashReceitas').innerText = formatMoney(currentStats.inc);
    document.getElementById('dashDespesas').innerText = formatMoney(currentStats.expPaid);
    document.getElementById('dashPendentes').innerText = formatMoney(currentStats.expPend);
    document.getElementById('sideBalance').innerText = formatMoney(currentStats.balance);

    updateTrend('trendSaldo', currentStats.balance, prevStats.balance, false);
    updateTrend('trendReceitas', currentStats.inc, prevStats.inc, false);
    updateTrend('trendDespesas', currentStats.expPaid, prevStats.expPaid, true);

    const currentMonthTxs = transactions.filter(t => t.month === currentMonth && t.year === currentYear);
    renderTransactionsList(currentMonthTxs);
    renderDashboardChart(currentStats.inc, currentStats.expPaid, currentStats.expPend);
}

function initApp() {
    setGreeting();
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    const savedData = localStorage.getItem('financas_app_data_v2');
    if (savedData) {
        transactions = JSON.parse(savedData);
    } else {
        const oldData = localStorage.getItem('financas_app_data');
        if(oldData) {
            transactions = JSON.parse(oldData);
        } else {
            transactions = generateExcelData();
        }
        saveData();
    }
    updateUI();
    calcRetirement();
    renderGoals();
}

// Inicia o app ao carregar
window.onload = initApp;
