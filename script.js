let fase = localStorage.getItem("fase") || "facil";

let tentativas = 0;
let segredo = [];
let tamanhoCodigo = 4;
let maxNumero = 6;

let jogoIniciado = false;
let venceu = false;

/* ================= INICIAR ================= */
window.onload = () => {
  document.body.classList.add("no-scroll");

  document.getElementById("nivel").value = fase;
  configurarNivel();
  fecharPopup();
  fecharCadeado();

  // 🔢 BLOQUEAR LETRAS NOS INPUTS
  const palpite = document.getElementById("palpite");
  const pass = document.getElementById("pass");

  palpite.addEventListener("input", () => {
    palpite.value = palpite.value.replace(/\D/g, "");
  });

  pass.addEventListener("input", () => {
    pass.value = pass.value.replace(/\D/g, "");
  });
};

/* ================= LOGIN ================= */
function login() {
  document.body.classList.remove("no-scroll");

  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const error = document.getElementById("error");

  if (!user || !pass) {
    error.innerText = "⚠️ Preencha todos os campos";
    return;
  }

  if (user !== "admin" || pass !== "1234") {
    error.innerText = "⚠️ Usuário ou senha inválidos";
    return;
  }

  error.innerText = "";

  document.getElementById("loginBox").classList.add("hidden");

  const game = document.getElementById("game");
  game.classList.remove("hidden");
  game.classList.add("fade-in");

  document.getElementById("welcome").innerText = "Bem-vindo " + user;

  jogoIniciado = true;
  reset();

  // 🎯 foco automático
  document.getElementById("palpite").focus();
}

/* ================= NÍVEL ================= */
function mudarNivel() {
  fase = document.getElementById("nivel").value;
  localStorage.setItem("fase", fase);

  configurarNivel();
  reset();
}

/* ================= CONFIG NÍVEL ================= */
function configurarNivel() {
  if (fase === "facil") {
    tamanhoCodigo = 4;
    maxNumero = 6;
  } else if (fase === "medio") {
    tamanhoCodigo = 5;
    maxNumero = 7;
  } else if (fase === "dificil") {
    tamanhoCodigo = 6;
    maxNumero = 8;
  } else {
    tamanhoCodigo = 7;
    maxNumero = 9;
  }

  const input = document.getElementById("palpite");

  input.maxLength = tamanhoCodigo;
  input.placeholder = gerarPlaceholder();

  document.getElementById("info").innerText =
    `Descubra o código de ${tamanhoCodigo} números (1 a ${maxNumero})`;
}

/* ================= PLACEHOLDER ================= */
function gerarPlaceholder() {
  return Array.from({ length: tamanhoCodigo }, (_, i) => i + 1).join("");
}

/* ================= GERAR CÓDIGO ================= */
function gerarCodigo() {
  return Array.from({ length: tamanhoCodigo }, () =>
    Math.floor(Math.random() * maxNumero) + 1
  );
}

/* ================= JOGAR ================= */
function jogar() {
  if (!jogoIniciado) return;

  const inputEl = document.getElementById("palpite");
  const input = inputEl.value.trim();

  // 🔢 validação simples (já bloqueia letras via input)
  if (input.length !== tamanhoCodigo) {
    alert(`Digite ${tamanhoCodigo} números`);
    return;
  }

  tentativas++;

  const res = verificar(input);

  const div = document.createElement("div");
  div.className = "tentativa fade-in";

  div.innerHTML = `
    <span class="codigo">${input}</span>
    <span class="seta">→</span>
    <span class="correto">✔ ${res.corretos}</span>
    <span class="deslocado">🔁 ${res.deslocados}</span>
  `;

  document.getElementById("log").prepend(div);

  if (res.corretos === tamanhoCodigo) {
    venceu = true;
    jogoIniciado = false;

    abrirCadeado();
    setTimeout(mostrarPopup, 800);
  }

  inputEl.value = "";
  inputEl.focus(); // 🔁 mantém foco
}

/* ================= VERIFICAR ================= */
function verificar(p) {
  let corretos = 0;
  let deslocados = 0;

  const segredoTemp = [...segredo];
  const tentativa = p.split("").map(Number);

  for (let i = 0; i < tamanhoCodigo; i++) {
    if (tentativa[i] === segredoTemp[i]) {
      corretos++;
      segredoTemp[i] = null;
      tentativa[i] = -1;
    }
  }

  for (let i = 0; i < tamanhoCodigo; i++) {
    if (tentativa[i] !== -1) {
      const index = segredoTemp.indexOf(tentativa[i]);
      if (index !== -1) {
        deslocados++;
        segredoTemp[index] = null;
      }
    }
  }

  return { corretos, deslocados };
}

/* ================= RESET ================= */
function reset() {
  tentativas = 0;
  venceu = false;

  segredo = gerarCodigo();

  document.getElementById("log").innerHTML = "";
  document.getElementById("palpite").value = "";

  fecharCadeado();
  fecharPopup();

  console.log("DEBUG segredo:", segredo);
}

/* ================= CADEADO ================= */
function abrirCadeado() {
  document.querySelector(".lock").classList.add("open");
}

function fecharCadeado() {
  document.querySelector(".lock").classList.remove("open");
}

/* ================= POPUP ================= */
function mostrarPopup() {
  if (!venceu) return;

  const popup = document.getElementById("popup");
  const texto = document.getElementById("popup-text");

  texto.innerText = `Você abriu o cadeado em ${tentativas} tentativas!`;

  popup.classList.remove("hidden");
}

function fecharPopup() {
  document.getElementById("popup").classList.add("hidden");
}

function reiniciarJogo() {
  fecharPopup();
  reset();
  jogoIniciado = true;

  document.getElementById("palpite").focus();
}