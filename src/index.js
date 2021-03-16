import './styles.css';
import ApiService from './apiService';
import cardTemplate from './templates/card-template.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import { Stack, alert, error } from '@pnotify/core';
import * as basicLightbox from 'basiclightbox';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.input'),
  gallery: document.querySelector('.gallery'),
  submitButton: document.querySelector('.submit-button'),
  pageBottom: document.querySelector('.pageBottom'),
};

const apiService = new ApiService();

function clearContent() {
  refs.gallery.innerHTML = '';
}

function onSearch(e) {
  e.preventDefault();
  apiService.searchQuery = e.currentTarget.elements.query.value
    .trim()
    .split(' ')
    .join('+');
  clearContent();

  apiService.resetPage();

  if (apiService.searchQuery === '') {
    return alert({
      text: 'Please enter valid name',
      delay: 1000,
      sticker: false,
      stack: new Stack({
        dir1: 'up',
        dir2: 'right',
        firstpos1: 30,
        firstpos2: 30,
      }),
    });
  }

  apiService.getImages().then(items => {
    refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(items));
  });
}

let observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (
      apiService.searchQuery !== '' &&
      entry.isIntersecting &&
      refs.gallery.children.length > 0
    )
      apiService
        .getImages()
        .then(items =>
          refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(items)),
        );
  });
});
observer.observe(refs.pageBottom);

refs.form.addEventListener('submit', onSearch);

// lightbox
refs.gallery.addEventListener('click', getBigImage);

function getBigImage(event) {
  const target = event.target;
  if (target.nodeName !== 'IMG') return;
  const bigImageURL = event.target.getAttribute('data-src');
  const instance = basicLightbox.create(`
  <img src="${bigImageURL}" width="800" height="600">
`);
  instance.show();
}
