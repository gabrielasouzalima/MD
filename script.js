// Configurações editáveis
// Substitua pelo número oficial no formato internacional, apenas números: 5531XXXXXXXXX
const WHATSAPP_NUMBER = "553181219772";
const INSTAGRAM_URL = "https://www.instagram.com/centroautomotivomdbetim";

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav__link");
const whatsappLinks = document.querySelectorAll(".js-whatsapp");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 4200);
}

function hasWhatsAppNumber() {
  return /^\d{10,15}$/.test(WHATSAPP_NUMBER) && !WHATSAPP_NUMBER.includes("000000");
}

function openWhatsApp(message) {
  if (!hasWhatsAppNumber()) {
    showToast("WhatsApp ainda não configurado: adicione o número oficial no script.js.");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

whatsappLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openWhatsApp(link.dataset.message || "Olá! Gostaria de falar com o Centro Automotivo MDB.");
  });
});

// Atualiza o ano do rodapé
document.getElementById("current-year").textContent = new Date().getFullYear();

// Destaque do item ativo no menu durante a rolagem
const sections = document.querySelectorAll("main section[id]");
const observerMenu = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach((section) => observerMenu.observe(section));

// Animações leves ao entrar na tela
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Formulário de orçamento com validação e mensagem preparada para o WhatsApp
const quoteForm = document.getElementById("quote-form");
const formStatus = document.getElementById("form-status");

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const requiredFields = [
    document.getElementById("nome"),
    document.getElementById("veiculo"),
    document.getElementById("servico")
  ];

  let firstInvalid = null;
  requiredFields.forEach((field) => {
    const wrapper = field.closest(".form-field");
    const invalid = field.value.trim() === "";
    wrapper.classList.toggle("invalid", invalid);
    if (invalid && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    formStatus.textContent = "Preencha os campos obrigatórios antes de continuar.";
    firstInvalid.focus();
    return;
  }

  const nome = document.getElementById("nome").value.trim();
  const veiculo = document.getElementById("veiculo").value.trim();
  const servico = document.getElementById("servico").value;
  const mensagem = document.getElementById("mensagem").value.trim();

  const text = [
    "Olá! Gostaria de solicitar um orçamento no Centro Automotivo MDB.",
    `Nome: ${nome}`,
    `Veículo: ${veiculo}`,
    `Serviço: ${servico}`,
    mensagem ? `Mensagem: ${mensagem}` : ""
  ].filter(Boolean).join("\n");

  formStatus.textContent = "Preparando conversa no WhatsApp...";
  openWhatsApp(text);
});
