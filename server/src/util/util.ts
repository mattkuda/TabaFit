/* eslint-disable import/prefer-default-export */
export const validateUsername = (username: string): { isValid: boolean, errorMessage?: string } => {
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  const reservedUsernames = ['admin', 'root', 'system'];

  if (username.length < 3) {
    return { isValid: false, errorMessage: 'Username is too short. It must be at least 3 characters long.' };
  }

  if (!usernameRegex.test(username)) {
    return { isValid: false, errorMessage: 'Invalid username. Only alphanumeric characters, underscores, and dots are allowed.' };
  }

  if (reservedUsernames.includes(username.toLowerCase())) {
    return { isValid: false, errorMessage: 'This username is reserved. Please choose another username.' };
  }

  return { isValid: true };
};
