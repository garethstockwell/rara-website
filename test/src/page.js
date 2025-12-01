// page.js

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');

  setTimeout(() => {
    header.classList.add('hidden');
  }, 1000);

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    console.log("currentY", currentY);

    if (currentY > lastScrollY) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    lastScrollY = currentY;
  });
  
  function toggleHeader() {
    header.classList.toggle('hidden');
  }

  document.getElementById("handle-header").addEventListener("click", toggleHeader);

  const siteContent = document.querySelector('.site-content');

  function toggleCommentary() {
    siteContent.classList.toggle('commentary-shown');
  }

  document.getElementById("dashboard").addEventListener("click", toggleCommentary);
});

/*
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');

  setTimeout(() => {
    header.classList.add('hidden');
  }, 1000);

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    lastScrollY = currentY;
  });
});
*/