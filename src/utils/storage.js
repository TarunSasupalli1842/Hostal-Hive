
export const initStorage = () => {
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
  }
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify([]));
  }
};

export const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
export const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
export const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
export const logout = () => localStorage.removeItem('currentUser');
