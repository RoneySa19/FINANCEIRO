function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getIconForDesc(desc) {
    const d = desc.toLowerCase();
    if(d.includes('cartao') || d.includes('cartão') || d.includes('nubank')) return { i: 'fa-credit-card', bg: 'bg-purple-100 text-purple-600' };
    if(d.includes('celular') || d.includes('telefone')) return { i: 'fa-mobile-screen', bg: 'bg-blue-100 text-blue-600' };
    if(d.includes('moto') || d.includes('carro') || d.includes('combustivel')) return { i: 'fa-car-side', bg: 'bg-orange-100 text-orange-600' };
    if(d.includes('mercado') || d.includes('comida') || d.includes('padaria')) return { i: 'fa-basket-shopping', bg: 'bg-emerald-100 text-emerald-600' };
    if(d.includes('cabelo') || d.includes('beleza') || d.includes('barbearia')) return { i: 'fa-scissors', bg: 'bg-pink-100 text-pink-600' };
    if(d.includes('aniversario') || d.includes('festa')) return { i: 'fa-cake-candles', bg: 'bg-yellow-100 text-yellow-600' };
    if(d.includes('salario') || d.includes('renda')) return { i: 'fa-building-columns', bg: 'bg-emerald-100 text-emerald-600' };
    return { i: 'fa-file-invoice', bg: 'bg-slate-100 text-slate-500' };
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    const colors = type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                   type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800';
    
    const icon = type === 'success' ? 'fa-circle-check text-emerald-500' : 
                 type === 'error' ? 'fa-trash-can text-red-500' : 'fa-circle-info text-blue-500';

    toast.className = `flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-lg ${colors} toast-animate`;
    toast.innerHTML = `<i class="fa-solid ${icon} text-xl"></i> <span class="font-medium text-sm">${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
