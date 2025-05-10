// config/api.ts
const API_BASE_URL = 'http://localhost:5001'

export const API_ENDPOINTS = {
    LESSONS: `${API_BASE_URL}/api/lessons`,
    VOWELS: `${API_BASE_URL}/api/vowels`,
    IMAGES: `${API_BASE_URL}/images`,
    AUDIO: `${API_BASE_URL}/audio`,
    AUDIO_VOWELS: `${API_BASE_URL}/api/audio/vowels`,
}
export default API_ENDPOINTS
