// Constantes e Variáveis Globais de Estado
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let currentMonth = new Date().getMonth(); // Atualizado para captar o mês real
let currentYear = new Date().getFullYear(); // Atualizado para captar o ano real
let transactions = [];
let txToDeleteId = null;

// Instâncias de Gráficos
let dashChartInstance = null;
let retChartInstance = null;

// Metas Fixas
const goals = [
    { name: "Reserva de Emergência", current: 3500, target: 10000, theme: "blue", icon: "fa-shield-halved" },
    { name: "Trocar de Moto", current: 2000, target: 15000, theme: "purple", icon: "fa-motorcycle" },
    { name: "Viagem Férias", current: 800, target: 3000, theme: "emerald", icon: "fa-plane" }
];
