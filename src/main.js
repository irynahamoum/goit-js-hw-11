import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const galleryGrid = document.querySelector('.gallery-grid');
const loader = document.querySelector('.loader');

let gallery = new SimpleLightbox('.gallery-grid a', {
  captionsData: 'alt',
});

const BASE_URL = 'https://pixabay.com/api/';

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const inputValue = event.target.elements.query.value.trim();

  if (!inputValue) {
    galleryGrid.innerHTML = '';
    iziToast.error({
      message: 'Search field is empty',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'inline-block';

  getImagesByInputValue(inputValue)
    .then(data => {
      if (data?.hits?.length > 0) {
        loader.style.display = 'none';
        createMarkupByHits(data.hits);
        return;
      }
      throw Error(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    })
    .catch(error => {
      iziToast.info({
        message:
          typeof error === 'string' ? error : 'Something went wrong, sorry!',
        position: 'topRight',
      });
    });

  event.target.reset();
}

function getImagesByInputValue(q) {
  const paramsStrQuery = new URLSearchParams({
    key: '42157668-d969611c6fdd34526589fe987',
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safeSearch: true,
  });

  const PARAMS = `?${paramsStrQuery}`;
  const url = BASE_URL + PARAMS;
  loader.style.display = 'inline-block';
  return fetch(url).then(response => response.json());
}

function createMarkupByHits(hits) {
  galleryGrid.innerHTML = '';

  const galleryItem = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}" class="gallery-card">
      <img src="${webformatURL}" alt="${tags}" >
      <div class="img-details-box">
      <p class="detail-item"><b>Likes:</b> ${likes}</p>
      <p class="detail-item"><b>Views:</b> ${views}</p>
      <p class="detail-item"><b>Comments:</b> ${comments}</p>
      <p class="detail-item"><b>Downloads:</b> ${downloads}</p></div>
      </a>`;
      }
    )
    .join('');

  galleryGrid.insertAdjacentHTML('beforeend', galleryItem);

  gallery.refresh();
}
