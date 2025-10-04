/**
 * Contact Form Handler
 */

export function initializeContactForm() {
  const form = document.querySelector('[data-id="contact-form"]');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmission);
  
  // Add real-time validation
  addFormValidation();
}

function handleFormSubmission(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('[data-id="submit-button"]');
  const formData = new FormData(form);
  
  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 mr-2 animate-spin"></i>Sending...';
  submitBtn.disabled = true;
  
  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Collect form data
  const formDataObj = {};
  for (let [key, value] of formData.entries()) {
    formDataObj[key] = value;
  }
  
  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    // Success case
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    form.reset();
    
    // Restore button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Log form data for demo purposes
    console.log('Form submitted with data:', formDataObj);
    
  }, 2000);
}

function addFormValidation() {
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearError);
  });
}

function validateField(event) {
  const field = event.target;
  const value = field.value.trim();
  
  // Remove existing error styling
  clearError({ target: field });
  
  // Check if required field is empty
  if (field.required && !value) {
    showFieldError(field, 'This field is required.');
    return false;
  }
  
  // Email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, 'Please enter a valid email address.');
      return false;
    }
  }
  
  // Name validation (no numbers or special characters)
  if ((field.name === 'firstName' || field.name === 'lastName') && value) {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(value)) {
      showFieldError(field, 'Please enter a valid name.');
      return false;
    }
  }
  
  return true;
}

function showFieldError(field, message) {
  field.classList.add('border-red-500');
  
  // Remove existing error message
  const existingError = field.parentElement.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error text-red-400 text-sm mt-1';
  errorDiv.textContent = message;
  field.parentElement.appendChild(errorDiv);
}

function clearError(event) {
  const field = event.target;
  field.classList.remove('border-red-500');
  
  const errorDiv = field.parentElement.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 max-w-sm`;
  
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
  
  const iconMap = {
    success: 'check-circle',
    error: 'x-circle',
    warning: 'alert-triangle',
    info: 'info'
  };
  
  notification.innerHTML = `
    <div class="flex items-center">
      <i data-lucide="${iconMap[type] || 'info'}" class="w-5 h-5 mr-3 flex-shrink-0"></i>
      <span>${message}</span>
      <button class="ml-3 text-white hover:text-gray-200 transition-colors" onclick="this.parentElement.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
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
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Export validation function for external use
export { validateField, showNotification };