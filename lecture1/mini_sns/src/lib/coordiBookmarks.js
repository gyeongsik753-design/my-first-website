const BOOKMARK_STORAGE_KEY = 'mini_sns_bookmarked_coordi_ids';

export const getBookmarkedCoordiIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

export const saveBookmarkedCoordiIds = (ids) =>
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify([...ids]));
