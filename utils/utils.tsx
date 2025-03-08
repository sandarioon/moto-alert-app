export const validatePhone = (phone: string) => {
  const regex = /^\+7\d{10}$/;
  return regex.test(phone);
};

export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
