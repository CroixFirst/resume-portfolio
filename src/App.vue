<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const language = ref<'ru' | 'en'>(localStorage.getItem('lang') === 'en' ? 'en' : 'ru');
const roles = {
  ru: ['PHP-разработчик', 'Специалист по Битрикс', 'Инженер по интеграциям'],
  en: ['PHP Developer', 'Bitrix Specialist', 'Integration Engineer'],
};

let typingTimer: ReturnType<typeof setTimeout> | undefined;
let scrollHandler: (() => void) | undefined;

function setLanguage(next: 'ru' | 'en') {
  language.value = next;
  document.documentElement.lang = next;
  document.title = next === 'ru' ? 'Николай Галкин - PHP-разработчик' : 'Nikolai Galkin - PHP Developer';
  document.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === next);
  });
  localStorage.setItem('lang', next);
}

function startTyping() {
  const typed = document.getElementById('typed');
  if (!typed) return;
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const type = () => {
    const word = roles[language.value][roleIndex];
    typed.textContent = word.slice(0, charIndex);
    if (!deleting && charIndex < word.length) { charIndex += 1; typingTimer = setTimeout(type, 90); }
    else if (deleting && charIndex > 0) { charIndex -= 1; typingTimer = setTimeout(type, 45); }
    else if (!deleting) { deleting = true; typingTimer = setTimeout(type, 1400); }
    else { deleting = false; roleIndex = (roleIndex + 1) % roles[language.value].length; typingTimer = setTimeout(type, 300); }
  };
  type();
}

onMounted(() => {
  setLanguage(language.value);
  document.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang === 'en' ? 'en' : 'ru'));
  });

  const sidebar = document.getElementById('sidebar');
  const burger = document.getElementById('burger');
  const menuOverlay = document.getElementById('overlay');
  const toggleMenu = (open: boolean) => {
    sidebar?.classList.toggle('open', open);
    menuOverlay?.classList.toggle('show', open);
  };
  burger?.addEventListener('click', () => toggleMenu(!sidebar?.classList.contains('open')));
  menuOverlay?.addEventListener('click', () => toggleMenu(false));
  document.querySelectorAll<HTMLAnchorElement>('#menu a').forEach((link) => {
    link.addEventListener('click', () => { if (window.innerWidth < 1280) toggleMenu(false); });
  });

  const revealElements = document.querySelectorAll<HTMLElement>('.reveal');
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: 0.15 }) : null;
  revealElements.forEach((element) => observer?.observe(element));
  setTimeout(() => revealElements.forEach((element) => element.classList.add('in')), 1200);

  const sections = [...document.querySelectorAll<HTMLElement>('section[id]')];
  const links = [...document.querySelectorAll<HTMLAnchorElement>('#menu a')];
  scrollHandler = () => {
    let current = sections[0]?.id;
    sections.forEach((section) => { if (window.scrollY + 160 >= section.offsetTop) current = section.id; });
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();

  const modal = document.getElementById('modalOverlay');
  const shot = document.getElementById('modalShot');
  const content = document.getElementById('modalContent');
  const close = document.getElementById('modalClose');
  let lastFocus: HTMLElement | null = null;
  const closeModal = () => {
    modal?.classList.remove('show'); modal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open'); lastFocus?.focus();
  };
  document.querySelectorAll<HTMLElement>('[data-case]').forEach((card) => card.addEventListener('click', () => {
    const detail = card.querySelector<HTMLElement>('.case-detail');
    if (!detail || !modal || !shot || !content) return;
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    shot.innerHTML = card.querySelector('.shot')?.innerHTML ?? '';
    content.innerHTML = detail.innerHTML;
    modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
    (close as HTMLButtonElement | null)?.focus();
  }));
  close?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal?.classList.contains('show')) closeModal(); });
  startTyping();
});

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer);
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
});
</script>

<template><span class="vue-controller" aria-hidden="true" /></template>
