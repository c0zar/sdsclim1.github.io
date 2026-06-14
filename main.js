// GESTION DU MENU BURGER MOBILE
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Ouvre ou ferme le menu au clic sur les barres
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Alterne l'icône entre les barres et la croix
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Ferme automatiquement le menu quand l'utilisateur clique sur un lien (pour faire défiler jusqu'à la section)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });
});