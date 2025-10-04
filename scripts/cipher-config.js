/**
 * Cipher Configuration Interface Logic
 */

let currentConfig = {
  cipher: null,
  keyExchange: null,
  authentication: null
};

const cipherData = {
  'aes-256-gcm': { name: 'AES-256-GCM', strength: 95, forwardSecrecy: true },
  'chacha20-poly1305': { name: 'ChaCha20-Poly1305', strength: 95, forwardSecrecy: true },
  'aes-128-gcm': { name: 'AES-128-GCM', strength: 85, forwardSecrecy: true },
  'aes-256-cbc': { name: 'AES-256-CBC', strength: 80, forwardSecrecy: true }
};

const keyExchangeData = {
  'ecdhe-x25519': { name: 'ECDHE-X25519', strength: 95, forwardSecrecy: true },
  'ecdhe-p256': { name: 'ECDHE-P256', strength: 90, forwardSecrecy: true },
  'dhe-2048': { name: 'DHE-2048', strength: 80, forwardSecrecy: true },
  'rsa-2048': { name: 'RSA-2048', strength: 60, forwardSecrecy: false }
};

const authData = {
  'ecdsa-p256': { name: 'ECDSA-P256', strength: 95 },
  'rsa-pss-2048': { name: 'RSA-PSS-2048', strength: 85 },
  'ed25519': { name: 'Ed25519', strength: 98 },
  'rsa-pkcs1-2048': { name: 'RSA-PKCS1-2048', strength: 75 }
};

export function initializeCipherConfig() {
  // Initialize selection handlers
  initializeSelectionHandlers();
  
  // Initialize action buttons
  initializeActionButtons();
  
  // Set default selections (recommended)
  selectOption('cipher', 'aes-256-gcm');
  selectOption('keyExchange', 'ecdhe-x25519');
  selectOption('authentication', 'ecdsa-p256');
}

function initializeSelectionHandlers() {
  // Cipher algorithm selection
  document.querySelectorAll('.cipher-option').forEach(option => {
    option.addEventListener('click', () => {
      const cipher = option.getAttribute('data-cipher');
      selectOption('cipher', cipher);
    });
  });
  
  // Key exchange selection
  document.querySelectorAll('.key-exchange-option').forEach(option => {
    option.addEventListener('click', () => {
      const kex = option.getAttribute('data-kex');
      selectOption('keyExchange', kex);
    });
  });
  
  // Authentication selection
  document.querySelectorAll('.auth-option').forEach(option => {
    option.addEventListener('click', () => {
      const auth = option.getAttribute('data-auth');
      selectOption('authentication', auth);
    });
  });
}

function selectOption(type, value) {
  // Update current configuration
  currentConfig[type] = value;
  
  // Update UI selections
  updateSelectionUI(type, value);
  
  // Update summary panel
  updateSummaryPanel();
  
  // Update security score
  updateSecurityScore();
  
  // Enable/disable action buttons
  updateActionButtons();
}

function updateSelectionUI(type, value) {
  const selectors = {
    cipher: '.cipher-option',
    keyExchange: '.key-exchange-option',
    authentication: '.auth-option'
  };
  
  const attributes = {
    cipher: 'data-cipher',
    keyExchange: 'data-kex',
    authentication: 'data-auth'
  };
  
  // Remove active class from all options of this type
  document.querySelectorAll(selectors[type]).forEach(option => {
    option.classList.remove('active-selection');
  });
  
  // Add active class to selected option
  const selectedOption = document.querySelector(`${selectors[type]}[${attributes[type]}="${value}"]`);
  if (selectedOption) {
    selectedOption.classList.add('active-selection');
  }
}

function updateSummaryPanel() {
  // Update cipher display
  const cipherDisplay = document.getElementById('cipher-display');
  if (currentConfig.cipher && cipherDisplay) {
    cipherDisplay.textContent = cipherData[currentConfig.cipher]?.name || 'Unknown';
  }
  
  // Update key exchange display
  const kexDisplay = document.getElementById('kex-display');
  if (currentConfig.keyExchange && kexDisplay) {
    kexDisplay.textContent = keyExchangeData[currentConfig.keyExchange]?.name || 'Unknown';
  }
  
  // Update authentication display
  const authDisplay = document.getElementById('auth-display');
  if (currentConfig.authentication && authDisplay) {
    authDisplay.textContent = authData[currentConfig.authentication]?.name || 'Unknown';
  }
}

function updateSecurityScore() {
  let totalScore = 0;
  let components = 0;
  
  // Calculate encryption strength
  if (currentConfig.cipher) {
    const cipherStrength = cipherData[currentConfig.cipher]?.strength || 0;
    totalScore += cipherStrength;
    components++;
    
    const encStrengthEl = document.getElementById('encryption-strength');
    if (encStrengthEl) {
      encStrengthEl.textContent = getStrengthLabel(cipherStrength);
    }
  }
  
  // Calculate key exchange strength
  if (currentConfig.keyExchange) {
    const kexStrength = keyExchangeData[currentConfig.keyExchange]?.strength || 0;
    totalScore += kexStrength;
    components++;
    
    const fsEl = document.getElementById('forward-secrecy');
    if (fsEl) {
      const hasFS = keyExchangeData[currentConfig.keyExchange]?.forwardSecrecy;
      fsEl.textContent = hasFS ? 'Yes' : 'No';
      fsEl.className = hasFS ? 'text-green-400' : 'text-red-400';
    }
  }
  
  // Calculate authentication strength
  if (currentConfig.authentication) {
    const authStrength = authData[currentConfig.authentication]?.strength || 0;
    totalScore += authStrength;
    components++;
    
    const authStrengthEl = document.getElementById('auth-strength');
    if (authStrengthEl) {
      authStrengthEl.textContent = getStrengthLabel(authStrength);
    }
  }
  
  // Update overall score
  const overallScore = components > 0 ? Math.round(totalScore / components) : 0;
  
  const percentageEl = document.getElementById('security-percentage');
  const barEl = document.getElementById('security-bar');
  
  if (percentageEl) {
    percentageEl.textContent = `${overallScore}%`;
  }
  
  if (barEl) {
    barEl.style.width = `${overallScore}%`;
    
    // Update bar color based on score
    if (overallScore >= 90) {
      barEl.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    } else if (overallScore >= 70) {
      barEl.style.background = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
    } else {
      barEl.style.background = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
    }
  }
}

function getStrengthLabel(score) {
  if (score >= 95) return 'Excellent';
  if (score >= 85) return 'Very Good';
  if (score >= 75) return 'Good';
  if (score >= 65) return 'Fair';
  return 'Weak';
}

function updateActionButtons() {
  const isComplete = currentConfig.cipher && currentConfig.keyExchange && currentConfig.authentication;
  
  const testBtn = document.getElementById('test-config-btn');
  const exportBtn = document.getElementById('export-config-btn');
  
  if (testBtn) {
    testBtn.disabled = !isComplete;
  }
  
  if (exportBtn) {
    exportBtn.disabled = !isComplete;
  }
}

function initializeActionButtons() {
  // Test configuration button
  const testBtn = document.getElementById('test-config-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      if (!testBtn.disabled) {
        testConfiguration();
      }
    });
  }
  
  // Export configuration button
  const exportBtn = document.getElementById('export-config-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!exportBtn.disabled) {
        exportConfiguration();
      }
    });
  }
  
  // Reset configuration button
  const resetBtn = document.getElementById('reset-config-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetConfiguration);
  }
}

function testConfiguration() {
  // Show loading state
  const testBtn = document.getElementById('test-config-btn');
  const originalText = testBtn.innerHTML;
  testBtn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 inline mr-2 animate-spin"></i>Testing...';
  testBtn.disabled = true;
  
  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Simulate testing
  setTimeout(() => {
    // Navigate to demo page with configuration
    const configParams = new URLSearchParams({
      cipher: currentConfig.cipher,
      kex: currentConfig.keyExchange,
      auth: currentConfig.authentication
    });
    
    window.location.href = `demo.html?${configParams.toString()}`;
  }, 2000);
}

function exportConfiguration() {
  const config = {
    cipherSuite: {
      cipher: {
        algorithm: currentConfig.cipher,
        name: cipherData[currentConfig.cipher]?.name
      },
      keyExchange: {
        algorithm: currentConfig.keyExchange,
        name: keyExchangeData[currentConfig.keyExchange]?.name,
        forwardSecrecy: keyExchangeData[currentConfig.keyExchange]?.forwardSecrecy
      },
      authentication: {
        algorithm: currentConfig.authentication,
        name: authData[currentConfig.authentication]?.name
      }
    },
    securityMetrics: {
      overallScore: calculateOverallScore(),
      encryptionStrength: cipherData[currentConfig.cipher]?.strength,
      keyExchangeStrength: keyExchangeData[currentConfig.keyExchange]?.strength,
      authenticationStrength: authData[currentConfig.authentication]?.strength,
      forwardSecrecy: keyExchangeData[currentConfig.keyExchange]?.forwardSecrecy
    },
    exportedAt: new Date().toISOString(),
    generatedBy: 'Ciphra Configuration Tool'
  };
  
  // Create and download JSON file
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ciphra-cipher-suite-config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Show success feedback
  showNotification('Configuration exported successfully!', 'success');
}

function resetConfiguration() {
  // Clear current configuration
  currentConfig = {
    cipher: null,
    keyExchange: null,
    authentication: null
  };
  
  // Clear UI selections
  document.querySelectorAll('.cipher-option, .key-exchange-option, .auth-option').forEach(option => {
    option.classList.remove('active-selection');
  });
  
  // Reset summary panel
  const cipherDisplay = document.getElementById('cipher-display');
  const kexDisplay = document.getElementById('kex-display');
  const authDisplay = document.getElementById('auth-display');
  
  if (cipherDisplay) cipherDisplay.textContent = 'Not Selected';
  if (kexDisplay) kexDisplay.textContent = 'Not Selected';
  if (authDisplay) authDisplay.textContent = 'Not Selected';
  
  // Reset security score
  const percentageEl = document.getElementById('security-percentage');
  const barEl = document.getElementById('security-bar');
  const encStrengthEl = document.getElementById('encryption-strength');
  const fsEl = document.getElementById('forward-secrecy');
  const authStrengthEl = document.getElementById('auth-strength');
  
  if (percentageEl) percentageEl.textContent = '0%';
  if (barEl) {
    barEl.style.width = '0%';
    barEl.style.background = 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)';
  }
  if (encStrengthEl) encStrengthEl.textContent = '-';
  if (fsEl) {
    fsEl.textContent = '-';
    fsEl.className = 'text-white';
  }
  if (authStrengthEl) authStrengthEl.textContent = '-';
  
  // Disable action buttons
  updateActionButtons();
  
  showNotification('Configuration reset successfully!', 'info');
}

function calculateOverallScore() {
  let totalScore = 0;
  let components = 0;
  
  if (currentConfig.cipher) {
    totalScore += cipherData[currentConfig.cipher]?.strength || 0;
    components++;
  }
  
  if (currentConfig.keyExchange) {
    totalScore += keyExchangeData[currentConfig.keyExchange]?.strength || 0;
    components++;
  }
  
  if (currentConfig.authentication) {
    totalScore += authData[currentConfig.authentication]?.strength || 0;
    components++;
  }
  
  return components > 0 ? Math.round(totalScore / components) : 0;
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
  
  // Set notification style based on type
  switch (type) {
    case 'success':
      notification.classList.add('bg-green-600', 'text-white');
      break;
    case 'error':
      notification.classList.add('bg-red-600', 'text-white');
      break;
    case 'warning':
      notification.classList.add('bg-yellow-600', 'text-white');
      break;
    default:
      notification.classList.add('bg-blue-600', 'text-white');
  }
  
  notification.innerHTML = `
    <div class="flex items-center">
      <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}