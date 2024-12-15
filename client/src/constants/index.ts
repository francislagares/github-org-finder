export const API_BASE_URL = {
  DEFAULT_API_BASE_URL: 'http://localhost:4000/api/v1',
  CUSTOM_API_BASE_URL: '',
} as const;

export const API_ENDPOINTS = {
  REPOS: 'repos',
  ORGS: 'orgs',
} as const;

export const API_OPERATIONS = {
  GET: 'get',
  POST: 'save',
  PUT: 'update',
  DELETE: 'delete',
} as const;

export const AXIOS_ERROR_MESSAGES = {
  DEFAULT_ERROR: 'An error occurred',
  NETWORK_ERROR: 'Network error',
  TIMEOUT_ERROR: 'Request timed out',
  SERVER_ERROR: 'Server error',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  SCROLL_THRESHOLD: 100,
} as const;

export const ERROR_MESSAGES = {
  FETCH_ERROR: 'Error fetching repositories',
  SAVE_ERROR: 'Error saving repository',
  DELETE_ERROR: 'Error deleting repository',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
} as const;

export const SUCCESS_MESSAGES = {
  REPO_SAVED: 'Repository saved successfully',
  REPO_DELETED: 'Repository deleted successfully',
} as const;
