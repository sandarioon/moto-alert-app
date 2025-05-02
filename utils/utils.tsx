export function validatePhone(phone: string) {
  const regex = /^\+7\d{10}$/;
  return regex.test(phone);
}

export function log(method: string, url: string, data: string) {
  return console.log(
    "\x1b[32m%s\x1b[0m",
    method + " " + url,
    "\n                 Response:",
    data
  );
}

export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
