/**
 * Component Loader - Dynamically loads HTML components
 */

export async function loadComponent(selector, filePath = null) {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element with selector "${selector}" not found`);
      return;
    }
    
    // Get file path from data-source attribute or parameter
    const componentPath = filePath || element.getAttribute('data-source');
    if (!componentPath) {
      console.warn(`No data-source attribute found for ${selector}`);
      return;
    }
    
    // Use the correct base path for the preview environment
    const basePath = window.location.origin + '/api/preview-68a47125466f555588853e48/';
    const fullPath = basePath + componentPath;
    
    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${response.status}`);
    }
    
    const html = await response.text();
    element.innerHTML = html;
    
    // Initialize any component-specific scripts
    initializeComponentScripts(element, componentPath);
    
  } catch (error) {
    console.error(`Error loading component ${selector}:`, error);
    // Fallback content
    if (selector === '#navbar-container') {
      element.innerHTML = '<nav class="bg-gray-900 p-4"><div class="text-white">Navigation Loading...</div></nav>';
    }
  }
}

function initializeComponentScripts(element, componentPath) {
  // Initialize mobile menu toggle for navbar
  if (componentPath.includes('navbar')) {
    initializeNavbar(element);
  }
}

function initializeNavbar(navElement) {
  const mobileMenuButton = navElement.querySelector('[data-id="mobile-menu-button"]');
  const mobileMenu = navElement.querySelector('[data-id="nav-menu-mobile"]');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      
      // Toggle icon between menu and X
      const icon = mobileMenuButton.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
      } else {
        icon.setAttribute('data-lucide', 'x');
      }
      
      // Re-initialize icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
}

// Load multiple components
export async function loadComponents(selectors) {
  const promises = selectors.map(selector => loadComponent(selector));
  return Promise.all(promises);
}