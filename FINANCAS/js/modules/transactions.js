function renderTransactionsList(list) {
    const tbody = document.getElementById('transactionsTableBody');
    const empty = document.getElementById('emptyState');
    document.getElementById('txCount').innerText = `${list.length} Registos`;
    
    tbody.innerHTML = '';
    if (list.length === 0) {
        empty.classList.remove('hidden');
        tbody.parentElement.classList.add('hidden');
    } else {
        empty.classList.add('hidden');
        tbody.parentElement.classList.remove('hidden');
        list.sort((a,b) => a.status.localeCompare(b.status));

        list.forEach(t => {
            let isIncome = t.type === 'income';
            let isPaid = t.status === 'paid';
            let styling = getIconForDesc(t.desc);
            
            let statusBadge = isPaid 
                ? `<button onclick="toggleTxStatus('${t.id}')" class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition shadow-sm border border-emerald-100 flex items-center justify-center gap-1 w-24 mx-auto"><i class="fa-solid fa-check"></i> Pago</button>`
                : `<button onclick="toggleTxStatus('${t.id}')" class="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold hover:bg-orange-100 transition shadow-sm border border-orange-100 flex items-center justify-center gap-1 w-24 mx-auto"><i class="fa-solid fa-clock"></i> Pend.</button>`;
            
            let tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/80 transition-colors group";
            tr.innerHTML = `
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl ${styling.bg} flex items-center justify-center shadow-sm">
                            <i class="fa-solid ${styling.i}"></i>
                        </div>
                        <span class="font-semibold text-slate-700">${t.desc}</span>
                    </div>
                </td>
                <td class="p-4 text-right">
                    <span class="font-bold block ${isIncome ? 'text-emerald-500' : 'text-slate-800'}">
                        ${isIncome ? '+' : '-'} ${formatMoney(t.amount)}
                    </span>
                </td>
                <td class="p-4">${statusBadge}</td>
                <td class="p-4 text-center">
                    <button onclick="confirmDeleteTx('${t.id}')" class="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function addTransaction(e) {
    e.preventDefault();
    const desc = document.getElementById('tDesc').value;
    const val = parseFloat(document.getElementById('tValue').value);
    const type = document.querySelector('input[name="tType"]:checked').value;
    const inst = parseInt(document.getElementById('tInstallments').value) || 1;
    const baseAmount = val / inst;

    for(let i = 0; i < inst; i++) {
        let targetMonth = currentMonth + i;
        let targetYear = currentYear;
        while (targetMonth > 11) { targetMonth -= 12; targetYear++; }

        let finalDesc = inst > 1 ? `${desc} (${i+1}/${inst})` : desc;
        let status = (i === 0) ? 'paid' : 'pending';
        let uniqueId = Date.now().toString() + Math.floor(Math.random() * 10000).toString();

        transactions.push({
            id: uniqueId, desc: finalDesc, amount: baseAmount,
            type: type, month: targetMonth, year: targetYear, status: status
        });
    }

    saveData();
    updateUI();
    showToast('Lançamento adicionado com sucesso!');
    
    document.getElementById('tDesc').value = '';
    document.getElementById('tValue').value = '';
    document.getElementById('tInstallments').value = '1';
}

function toggleTxStatus(id) {
    const tx = transactions.find(t => t.id === id);
    if(tx) {
        tx.status = tx.status === 'paid' ? 'pending' : 'paid';
        saveData();
        updateUI();
        showToast(tx.status === 'paid' ? 'Marcado como Pago!' : 'Movido para Pendentes.', 'info');
    }
}

function confirmDeleteTx(id) {
    txToDeleteId = id;
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('opacity-100'), 10);
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
    txToDeleteId = null;
}

function executeDelete() {
    if(txToDeleteId) {
        transactions = transactions.filter(t => t.id !== txToDeleteId);
        saveData();
        updateUI();
        showToast('Registo apagado com sucesso', 'error');
        closeDeleteModal();
    }
}