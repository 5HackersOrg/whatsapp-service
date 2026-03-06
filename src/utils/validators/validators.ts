export const validators = {
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string) => {
    return password && password.length >= 8;
  },

  parseLoginCredentials: (message: string) => {
    const parts = message.split(":");
    if (parts.length !== 2) return null;
    const [email, password] = parts;
    return { email: email!.toLowerCase().trim(), password: password!.trim() };
  },
};
