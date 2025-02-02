export const validatePhone = (phone: string) => {
  const regex = /^\+?8\d{10}$|^\+?7\d{10}$|^\d{11}$/;
  return regex.test(phone);
};
