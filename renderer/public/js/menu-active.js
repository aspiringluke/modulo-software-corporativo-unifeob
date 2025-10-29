document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  const buttonMap = {
    "auditoria": "clock",
    "config": "settings",
    "relatorios": "stats",
  };

  for (const [keyword, className] of Object.entries(buttonMap)) {
    if (path.includes(keyword)) {
      const button = document.querySelector(`.menu-btn.${className}`);
      if (button) {
        button.classList.add("active");
      }
      break;
    }
  }
});
