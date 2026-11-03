let currentUser = null;
let initialized = false;

export const sessionModel = Object.freeze({
  isSignedIn() {
    return Boolean(currentUser);
  },
  getUser() {
    return currentUser;
  },
  setUser(user) {
    currentUser = user;
    initialized = true;
  },
  isInitialized() {
    return initialized;
  }
});
