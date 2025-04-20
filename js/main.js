(function () {
  "use strict";


  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);


  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });


  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });


  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);


  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();


let canSendMessage = true;
const toggleChatbot = () => {
  const popup = document.getElementById('chatbot-popup');
  const isVisible = popup.style.display === 'flex';
  popup.style.display = isVisible ? 'none' : 'flex';
  document.body.classList.toggle('chatbot-active', !isVisible);
}

const handleChatKey = async (event) => {
  if (event.key === 'Enter') {
    //check cooldown if users tries to send message
    if (!canSendMessage) {
      alert("Please wait a few seconds before asking another question.");
      return;
    }

    const input = document.getElementById("chatbot-input");
    const msg = input.value.trim();
    if (!msg) return;

    const container = document.getElementById("chatbot-messages");
    container.innerHTML += `<div><b>You:</b> ${msg}</div>`;
    input.value = "";

    canSendMessage = false;
    setTimeout(() => {
      canSendMessage = true;
    }, 4000);

    try {
      const res = await fetch("http://localhost:3001/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      container.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      container.innerHTML += `<div><b>Bot:</b> Error connecting to server.</div>`;
    }
  }
};

function showToast(message) {
  const toastEl = document.getElementById('myToast');
  const toastBody = toastEl.querySelector('.toast-body');
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
document.querySelector('#myToast .btn-close').addEventListener('click', () => {
  document.getElementById('myToast').classList.remove('show');
});