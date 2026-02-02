// Admin System
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

let isAdminLoggedIn = false;
let adminSettings = {
  displayNumber: ""
};

// Toggle hamburger menu
function toggleMenu() {
  const nav = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.hamburger');
  nav.classList.toggle('active');
  hamburger.classList.toggle('active');
}

// Terms and Conditions System
function checkTermsAccepted() {
  return localStorage.getItem('termsAccepted') === 'true';
}

function acceptTerms() {
  localStorage.setItem('termsAccepted', 'true');
  document.getElementById('termsModal').style.display = 'none';
  document.body.classList.remove('terms-pending');
}

function declineTerms() {
  alert('You must accept the terms and conditions to use Stalone Invest.');
  // Optionally redirect or do nothing to keep modal visible
}

// Show terms modal on page load if not yet accepted
function showTermsIfNeeded() {
  if (!checkTermsAccepted()) {
    document.getElementById('termsModal').style.display = 'flex';
    document.body.classList.add('terms-pending');
  } else {
    document.getElementById('termsModal').style.display = 'none';
    document.body.classList.remove('terms-pending');
  }
}

// Show terms modal when clicked from footer
function showTermsModal() {
  document.getElementById('termsModal').style.display = 'flex';
}

// Update number display
function updateNumberDisplay() {
  const numberBox = document.getElementById('numberDisplay');
  if (numberBox) {
    numberBox.textContent = adminSettings.displayNumber || ""; 
  }
}

// Load settings from localStorage
function loadAdminSettings() {
  const saved = localStorage.getItem('adminSettings');
  if (saved) {
    const loadedSettings = JSON.parse(saved);
    // Merge with default settings to ensure new properties are present
    adminSettings = { ...adminSettings, ...loadedSettings };
    updateAdminDisplay();
  }
}

// Save settings to localStorage
function saveAdminSettings() {
  localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
  updateAdminDisplay();
  updateNumberDisplay(); // Update the number display box on homepage
}

// Update display with admin settings
function updateAdminDisplay() {
  // Update admin form values
  const numberDisplayInput = document.getElementById('adminNumberDisplay');
  if (numberDisplayInput) numberDisplayInput.value = adminSettings.displayNumber;
}

// Check if admin is logged in
function checkAdminStatus() {
  const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  isAdminLoggedIn = loggedIn;

  const adminLink = document.getElementById('adminLoginLink');
  const adminBtn = document.getElementById('adminAccessBtn');
  const adminSection = document.getElementById('admin');

  if (isAdminLoggedIn) {
    adminLink.textContent = 'Dashboard';
    adminLink.onclick = () => document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
    adminBtn.style.display = 'block';
    adminSection.style.display = 'block';
  } else {
    adminLink.textContent = 'Admin';
    adminLink.onclick = showAdminLogin;
    adminBtn.style.display = 'none';
    adminSection.style.display = 'none';
  }
}

// Show admin login modal
function showAdminLogin() {
  document.getElementById('adminModal').style.display = 'block';
}

// Hide admin login modal
function hideAdminLogin() {
  document.getElementById('adminModal').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
}

// Handle admin login
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  const errorDiv = document.getElementById('loginError');

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    isAdminLoggedIn = true;
    localStorage.setItem('adminLoggedIn', 'true');
    hideAdminLogin();
    checkAdminStatus();
    updateAdminDisplay();
    alert('Admin login successful!');
  } else {
    errorDiv.textContent = 'Invalid username or password';
    errorDiv.style.display = 'block';
  }

  // Clear form
  this.reset();
});

// Admin controls
document.getElementById('logoutBtn').addEventListener('click', function() {
  isAdminLoggedIn = false;
  localStorage.removeItem('adminLoggedIn');
  checkAdminStatus();
  alert('Logged out successfully!');
});

document.getElementById('updateNumber').addEventListener('click', function() {
  if (!isAdminLoggedIn) return;
  adminSettings.displayNumber = document.getElementById('adminNumberDisplay').value;
  saveAdminSettings();
  alert('Number display updated successfully!');
});

document.getElementById('toggleAdmin').addEventListener('click', function() {
  document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
});

// Modal close handlers
document.querySelector('.close').addEventListener('click', hideAdminLogin);
window.addEventListener('click', function(event) {
  const modal = document.getElementById('adminModal');
  if (event.target === modal) {
    hideAdminLogin();
  }
});

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
  showTermsIfNeeded();
  loadAdminSettings();
  checkAdminStatus();
  updateNumberDisplay(); // Display numbers on page load
  
  // Terms and Conditions button handlers
  document.getElementById('agreeBtn').addEventListener('click', acceptTerms);
  document.getElementById('declineBtn').addEventListener('click', declineTerms);
});

// Handle Payment
document.getElementById("paymentForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const accountName = document.getElementById("accountName").value;
      const accountNumber = document.getElementById("accountNumber").value;
      const bankName = document.getElementById("bankName").value;
  // Fixed amount: 30,000 NGN
  const amount = 30000;

      const handler = PaystackPop.setup({
        key: 'pk_live_1fcb965c9c209f782b648e36092f6818cc337ab2', // Replace with your Paystack public key
        email: email,
        amount: amount * 100, // Paystack expects amount in kobo (multiply by 100)
        currency: 'NGN',
        ref: 'tx-' + Date.now(), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our SDK will generate one for you
        metadata: {
          custom_fields: [
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: name
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phone
            },
            {
              display_name: "Account Name",
              variable_name: "account_name",
              value: accountName
            },
            {
              display_name: "Account Number",
              variable_name: "account_number",
              value: accountNumber
            },
            {
              display_name: "Bank Name",
              variable_name: "bank_name",
              value: bankName
            }
          ]
        },
        callback: function(response) {
          alert("Payment Successful! Transaction Reference: " + response.reference);
          console.log(response);
        },
        onClose: function() {
          alert("Payment window closed.");
        }
      });

      handler.openIframe();
    });

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  showTermsIfNeeded();
  loadAdminSettings();
  updateNumberDisplay();
});