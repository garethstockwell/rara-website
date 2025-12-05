window.raraMapsData = { baseUrl: 'http://localhost:3000' };

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');

  setTimeout(() => {
    header.classList.add('hidden');
  }, 1000);

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    console.log('currentY', currentY);

    if (currentY > lastScrollY) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    lastScrollY = currentY;
  });
});

window.createToolbar = function (name) {
  function addToolbarItem(itemName, text, active) {
    const link = document.createElement('a');
    link.href = `${itemName}.html`;
    link.textContent = text;
    link.className = active ? 'active' : '';

    const toolbar = document.getElementById('toolbar');
    toolbar.appendChild(link);
  }

  new Map([
    ['index', 'Attractions'],
    ['improvements', 'Improvements'],
    ['history', 'History'],
    ['heritage_trail', 'Heritage trail'],
    ['boundary_radius', 'Boundary radius'],
    ['boundary_tangent', 'Boundary tangent'],
    ['vector', 'Vector'],
    ['globe', 'Globe'],
    ['raster', 'Raster'],
  ]).forEach(function (value, key) {
    addToolbarItem(key, value, key === name);
  });
};
