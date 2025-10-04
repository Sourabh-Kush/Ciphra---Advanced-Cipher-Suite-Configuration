/**
 * demo-interface.js
 * Real AES-GCM encryption & decryption using Web Crypto API
 */

let aesKey = null;

/* --- Helpers --- */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function addTerminalLine(type, message) {
  const terminal = document.getElementById("terminal-output");
  if (!terminal) return;
  const line = document.createElement("div");
  line.className = type === "error" ? "text-red-500"
                 : type === "success" ? "text-green-500"
                 : "text-gray-300";
  line.textContent = `[${type.toUpperCase()}] ${message}`;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

/* --- Key Management --- */
async function generateKey() {
  aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  addTerminalLine("info", "New AES key generated.");
}

async function exportKey() {
  if (!aesKey) {
    addTerminalLine("error", "No key available to export.");
    return;
  }
  const jwk = await crypto.subtle.exportKey("jwk", aesKey);
  const blob = new Blob([JSON.stringify(jwk, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "aes-key.json";
  a.click();

  addTerminalLine("success", "Key exported as aes-key.json.");
}

async function importKey(file) {
  const text = await file.text();
  const jwk = JSON.parse(text);
  aesKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  addTerminalLine("success", "AES key imported successfully.");
}

/* --- Initialization --- */
export async function initializeDemoInterface() {
  await generateKey();

  const encryptBtn = document.getElementById("encrypt-btn");
  const decryptBtn = document.getElementById("decrypt-btn");
  const regenBtn = document.getElementById("regenerate-key-btn");
  const exportBtn = document.getElementById("export-key-btn");
  const importInput = document.getElementById("import-key-input");

  if (encryptBtn) encryptBtn.addEventListener("click", performEncryption);
  if (decryptBtn) decryptBtn.addEventListener("click", performDecryption);
  if (regenBtn) regenBtn.addEventListener("click", generateKey);
  if (exportBtn) exportBtn.addEventListener("click", exportKey);
  if (importInput) importInput.addEventListener("change", e => {
    if (e.target.files.length > 0) importKey(e.target.files[0]);
  });

  addTerminalLine("info", "AES-GCM demo system ready.");
}

/* --- Encryption --- */
async function performEncryption() {
  const plaintextInput = document.getElementById("plaintext-input");
  const encryptedOutput = document.getElementById("encrypted-output");
  const ciphertextInput = document.getElementById("ciphertext-input");

  const plaintext = plaintextInput.value.trim();
  if (!plaintext) {
    addTerminalLine("error", "No plaintext provided.");
    return;
  }

  try {
    const data = new TextEncoder().encode(plaintext);

    // ✅ Always generate a new random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      data
    );

    const ciphertextBase64 = arrayBufferToBase64(encrypted);
    const result = { ciphertext: ciphertextBase64, iv: Array.from(iv) };

    // ✅ Clear outputs before updating
    encryptedOutput.textContent = "";
    ciphertextInput.value = "";

    encryptedOutput.textContent = ciphertextBase64;
    ciphertextInput.value = JSON.stringify(result);

    addTerminalLine("success", "Encryption successful.");
  } catch (err) {
    addTerminalLine("error", "Encryption failed: " + err.message);
  }
}

/* --- Decryption --- */
async function performDecryption() {
  const ciphertextInput = document.getElementById("ciphertext-input");
  const decryptedOutput = document.getElementById("decrypted-output");

  try {
    const parsed = JSON.parse(ciphertextInput.value.trim());
    const ciphertext = base64ToArrayBuffer(parsed.ciphertext);
    const iv = new Uint8Array(parsed.iv);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      ciphertext
    );

    const plaintext = new TextDecoder().decode(decrypted);

    // ✅ Clear output before updating
    decryptedOutput.textContent = "";
    decryptedOutput.textContent = plaintext;

    addTerminalLine("success", "Decryption successful.");
  } catch (err) {
    addTerminalLine("error", "Decryption failed: " + err.message);
  }
}
