import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api'
});

export function createFilm(payload, documentFile) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  if (documentFile) {
    formData.append('document', documentFile);
  }
  return apiClient.post('/create-film', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function fetchProjects() {
  return apiClient.get('/projects');
}

export function fetchProgress(id) {
  return apiClient.get(`/progress/${id}`);
}
