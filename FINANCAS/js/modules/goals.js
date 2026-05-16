function renderGoals() {
    const container = document.getElementById('goalsContainer');
    container.innerHTML = '';

    const themes = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' }
    };

    goals.forEach(g => {
        let percent = Math.min(100, Math.round((g.current / g.target) * 100));
        let t = themes[g.theme];
        
        container.innerHTML += `
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover-lift relative overflow-hidden group">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h4 class="font-bold text-slate-800 text-lg">${g.name}</h4>
                        <p class="text-xs text-slate-400 font-medium mt-1">Progresso atual</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl ${t.light} ${t.text} flex items-center justify-center text-xl shadow-sm">
                        <i class="fa-solid ${g.icon}"></i>
                    </div>
                </div>
                
                <div class="flex items-end justify-between mb-3">
                    <h2 class="text-2xl font-bold text-slate-800">${formatMoney(g.current)}</h2>
                </div>
                
                <div class="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                    <div class="${t.bg} h-full rounded-full transition-all duration-1000 ease-out relative" style="width: 0%" data-target="${percent}%">
                        <div class="absolute inset-0 bg-white/20"></div>
                    </div>
                </div>
                
                <div class="flex justify-between items-center text-sm">
                    <span class="text-slate-400 font-medium">Meta: ${formatMoney(g.target)}</span>
                    <span class="${t.text} font-bold">${percent}%</span>
                </div>
            </div>
        `;
    });

    setTimeout(() => {
        container.querySelectorAll('[data-target]').forEach(bar => {
            bar.style.width = bar.getAttribute('data-target');
        });
    }, 100);
}