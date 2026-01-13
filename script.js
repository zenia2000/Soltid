/**
 * ARIA Dropdown Menu Controller
 * Manages aria-expanded and aria-hidden states for accessible dropdowns.
 * Also handles focus management and keyboard interactions.
 * Also manages hamburger menu toggle for mobile.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Dark mode toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Load saved theme preference from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  
  // Update toggle button icon based on current theme
  function updateToggleIcon() {
    const currentTheme = html.getAttribute('data-theme');
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }
  
  updateToggleIcon();
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon();
    });
  }

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('nav ul');

  if (hamburger && navUl) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navUl.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });

    // Close menu when clicking on a link
    const navLinks = navUl.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navUl.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('nav')) {
        hamburger.classList.remove('active');
        navUl.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const dropdownButtons = document.querySelectorAll('.dropbtn[aria-haspopup="true"]');

  dropdownButtons.forEach((button) => {
    const menuContainer = button.nextElementSibling;
    if (!menuContainer || !menuContainer.classList.contains('dropdown-content')) {
      return;
    }

    // Click handler: toggle menu open/closed
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      
      // On mobile, check if we should show/hide the dropdown
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        menuContainer.classList.toggle('active');
        button.setAttribute('aria-expanded', menuContainer.classList.contains('active'));
      } else {
        toggleMenu(button, menuContainer);
      }
    });

    // Keyboard handler: Enter/Space to open, Escape to close
    button.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        if (!isExpanded) {
          openMenu(button, menuContainer);
        }
      } else if (e.key === 'Escape') {
        closeMenu(button, menuContainer);
        button.focus();
      }
    });

    // Menu items: arrow keys, Escape, and Enter to navigate/close
    const menuItems = menuContainer.querySelectorAll('[role="menuitem"]');
    menuItems.forEach((item, index) => {
      item.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % menuItems.length;
          menuItems[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
          menuItems[prevIndex].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeMenu(button, menuContainer);
          button.focus();
        }
      });
    });
  });

  // Close all menus when clicking outside
  document.addEventListener('click', function (e) {
    dropdownButtons.forEach((button) => {
      const menuContainer = button.nextElementSibling;
      if (
        menuContainer &&
        menuContainer.classList.contains('dropdown-content') &&
        button.getAttribute('aria-expanded') === 'true'
      ) {
        // Check if click is outside this dropdown
        if (!button.contains(e.target) && !menuContainer.contains(e.target)) {
          closeMenu(button, menuContainer);
        }
      }
    });
  });
});

/**
 * Opens a dropdown menu
 */
function openMenu(button, menuContainer) {
  button.setAttribute('aria-expanded', 'true');
  menuContainer.setAttribute('aria-hidden', 'false');
  // Focus the first menu item
  const firstMenuItem = menuContainer.querySelector('[role="menuitem"]');
  if (firstMenuItem) {
    firstMenuItem.focus();
  }
}

/**
 * Closes a dropdown menu
 */
function closeMenu(button, menuContainer) {
  button.setAttribute('aria-expanded', 'false');
  menuContainer.setAttribute('aria-hidden', 'true');
}

/**
 * Toggles a dropdown menu open/closed
 */
function toggleMenu(button, menuContainer) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeMenu(button, menuContainer);
  } else {
    openMenu(button, menuContainer);
  }
}
