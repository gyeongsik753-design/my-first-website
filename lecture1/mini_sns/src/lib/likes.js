const LIKED_STORAGE_KEY = 'mini_sns_liked_post_ids';

export const getLikedIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

export const saveLikedIds = (ids) => localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify([...ids]));
