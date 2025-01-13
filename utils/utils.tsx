export const validatePhone = (phone: string) => {
  const regex = /^\d{11}$/;
  return regex.test(phone);
};
