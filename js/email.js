// Arma el texto de resultados y lo manda por Web3Forms (sin backend propio).
//
// Para activarlo: andá a https://web3forms.com, poné tu mail, y te dan una
// access key al instante (no hace falta cuenta). Pegala acá abajo.

const CONFIG = {
  ACCESS_KEY: "713a1a5b-763c-480d-b66e-bd92b49c8228",
  SUBJECT: "🎁 Maite ya eligió su regalo",
};

const SESSION_FLAG = "regaloBattleSent";

function buildMessage() {
  const lines = [`GANADOR: ${champion.title}`, ""];

  if (ideaText.trim()) {
    lines.push("SE LE OCURRIÓ:", `  "${ideaText.trim()}"`, "");
  }

  lines.push("Todos los duelos:");
  history.forEach((h) => {
    lines.push(`  ${h.round}. ${h.winner}  ganó a  ${h.loser}`);
  });

  return lines.join("\n");
}

async function handleDone() {
  if (sending || sent) return;
  sending = true;

  const doneBtn = document.getElementById("done-button");
  doneBtn.disabled = true;
  doneBtn.textContent = TEXTS.sendingButton;
  document.getElementById("send-error").hidden = true;

  const ok = await sendResults();

  sending = false;

  if (ok) {
    sent = true;
    sessionStorage.setItem(SESSION_FLAG, "1");
    showThanks();
  } else {
    doneBtn.disabled = false;
    doneBtn.textContent = TEXTS.doneButton;
    const errorEl = document.getElementById("send-error");
    errorEl.textContent = TEXTS.errorBody;
    errorEl.hidden = false;
    document.getElementById("copy-button").hidden = false;
    document.getElementById("copy-button").textContent = TEXTS.copyButton;
  }
}

async function sendResults() {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: CONFIG.ACCESS_KEY,
        subject: CONFIG.SUBJECT,
        message: buildMessage(),
      }),
    });
    const data = await res.json();
    return Boolean(data && data.success);
  } catch (err) {
    console.error("No se pudo enviar el resultado:", err);
    return false;
  }
}

function showThanks() {
  document.getElementById("final-title").textContent = TEXTS.thanksTitle;
  document.getElementById("final-body").textContent = TEXTS.thanksBody;
  document.getElementById("card-winner").hidden = true;
  document.getElementById("idea-field").hidden = true;
  document.getElementById("done-button").hidden = true;
  document.getElementById("send-error").hidden = true;
  document.getElementById("copy-button").hidden = true;
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(buildMessage());
    const btn = document.getElementById("copy-button");
    btn.textContent = TEXTS.copiedButton;
    setTimeout(() => (btn.textContent = TEXTS.copyButton), 2000);
  } catch (err) {
    console.error("No se pudo copiar:", err);
  }
}

// Red de seguridad: si Maite cierra la pestaña en la pantalla final sin
// apretar "Listo", igual mandamos lo que haya hasta ese momento. No se
// dispara si ya se envió (sent) o si ni siquiera llegó a la pantalla final
// (champion sigue sin definirse hasta el último duelo).
window.addEventListener("pagehide", () => {
  if (sent || sending) return;
  if (!champion || challengerIndex < deck.length) return;
  if (sessionStorage.getItem(SESSION_FLAG)) return;

  sessionStorage.setItem(SESSION_FLAG, "1");
  const payload = JSON.stringify({
    access_key: CONFIG.ACCESS_KEY,
    subject: CONFIG.SUBJECT,
    message: buildMessage(),
  });
  navigator.sendBeacon(
    "https://api.web3forms.com/submit",
    new Blob([payload], { type: "application/json" })
  );
});
