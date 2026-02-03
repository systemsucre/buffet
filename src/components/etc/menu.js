document.querySelectorAll('.has-submenu > a').forEach(item => {
  item.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
      e.preventDefault(); // Evita que el link cargue otra página
      const submenu = item.nextElementSibling;
      submenu.classList.toggle('show');
    }
  });
});