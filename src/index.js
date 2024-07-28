// index.js
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api.js';

let currentPage = 1;
let currentQuery = '';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a');

const onFormSubmit = e => {
  e.preventDefault();
  currentQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!currentQuery) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';
  onSearch(currentQuery);
};

const onSearch = async query => {
  try {
    const data = await fetchImages(query, currentPage);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
      renderGallery(data.hits);
      lightbox.refresh();

      if (currentPage < Math.ceil(data.totalHits / 40)) {
        loadMoreButton.style.display = 'block';
      } else {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error('Search error:', error);
    Notiflix.Notify.failure(
      'An error occurred during the search. Please try again.'
    );
  }
};

const renderGallery = images => {
  const html = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
      <a href="${largeImageURL}" target="_blank">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>
    `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', html);
};

loadMoreButton.addEventListener('click', () => {
  currentPage += 1;
  onSearch(currentQuery);
});

form.addEventListener('submit', onFormSubmit);