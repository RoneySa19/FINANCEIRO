function saveData() {
    localStorage.setItem('financas_app_data_v2', JSON.stringify(transactions));
}

// === NOVAS FUNCIONALIDADES DE BACKUP ===

function exportData() {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Backup exportado com sucesso!', 'success');
}

function importData(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if(Array.isArray(parsed)) {
            transactions = parsed;
            saveData();
            updateUI();
            showToast('Dados importados com sucesso!', 'success');
        } else {
            showToast('Formato de ficheiro inválido.', 'error');
        }
    } catch(e) {
        showToast('Erro ao ler o ficheiro.', 'error');
    }
}

function clearAllData() {
    if(confirm("ATENÇÃO: Isto apagará TODOS os seus registos. Tem a certeza absoluta?")) {
        transactions = [];
        saveData();
        updateUI();
        showToast('Todos os dados foram apagados.', 'info');
    }
}

// === GERAÇÃO DOS DADOS DO EXCEL ===

function generateExcelData() {
    const raw = [
        { desc: 'Cartão Caixa', type: 'expense', vals: {1: 252, 2: 252, 3: 252, 4: 252, 6: 455, 7: 252, 8: 252, 9: 252, 10: 252, 11: 252, 12: 252} },
        { desc: 'Nubank Roney', type: 'expense', vals: {1: 100, 2: 100, 3: 100, 4: 100, 7: 170, 8: 174, 9: 170, 10: 170, 11: 100, 12: 100} },
        { desc: 'Aniversário Noah', type: 'expense', vals: {6: 300, 10: 500} },
        { desc: 'Celular e Seguro', type: 'expense', vals: {1: 140, 2: 140, 3: 140, 4: 140, 6: 140, 7: 140, 8: 140, 9: 140, 10: 140, 11: 140, 12: 140} },
        { desc: 'Cabelereiro', type: 'expense', vals: {1: 80, 2: 80, 3: 80, 4: 80, 5: 80, 6: 80, 7: 80, 8: 80, 9: 80, 10: 80, 11: 80, 12: 80} },
        { desc: 'Seguro Moto', type: 'expense', vals: {1: 140, 2: 140, 3: 140, 4: 140, 6: 140, 7: 140, 8: 140, 9: 140, 10: 140, 11: 140, 12: 140} },
        { desc: 'Salário Principal', type: 'income', vals: {1: 3000, 2: 3000, 3: 3000, 4: 3000, 5: 3000, 6: 3000, 7: 3000, 8: 3000, 9: 3000, 10: 3000, 11: 3000, 12: 3000}}
    ];
    let data = [];
    const mesAtualReal = new Date().getMonth();
    
    raw.forEach(item => {
        Object.entries(item.vals).forEach(([m, val]) => {
            let monthIdx = parseInt(m) - 1;
            // Inteligência: Marca como 'pago' apenas se o mês já tiver passado ou for o atual
            let status = (monthIdx <= mesAtualReal) ? 'paid' : 'pending'; 
            
            // Segurança: Gerador de ID único robusto
            let uniqueId = Date.now().toString() + Math.floor(Math.random() * 10000).toString();
            
            data.push({
                id: uniqueId, 
                desc: item.desc, 
                amount: parseFloat(val),
                type: item.type, 
                month: monthIdx, 
                year: 2026, 
                status: status
            });
        });
    });
    return data;
}
