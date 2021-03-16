import settings from './settings';
const { BASE_URL, key } = settings;

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchPhotos() {
    const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.pageNumber}&per_page=12&key=${key}`;
    return fetch(url);
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  async getImages(searchQuery) {
    try {
      this.incrementPage();
      const response = await this.fetchPhotos();
      const result = await response.json();
      return result.hits;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
