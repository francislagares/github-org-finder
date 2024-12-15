export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  SCROLL_THRESHOLD: 100,
} as const;

export const API_ENDPOINTS = {
  REPOS: '/repos',
  ORGS: '/orgs',
  HEALTH: '/health',
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
