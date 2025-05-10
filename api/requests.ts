// Auth
export const AUTH_LOGIN = "/auth/login";
export const AUTH_LOGIN_ERROR = "Не удалось авторизоваться";

export const AUTH_CREATE = "/auth/create";
export const AUTH_CREATE_ERROR = "Не удалось создать пользователя";

export const AUTH_VERIFY_CODE = "/auth/verifyCode";
export const AUTH_VERIFY_CODE_ERROR = "Не удалось проверить код подтверждения";

export const AUTH_RESEND_CODE = "/auth/resendCode";
export const AUTH_RESEND_CODE_ERROR =
  "Не удалось повторно отправить код подтверждения";

export const AUTH_FORGOT_PASSWORD = "/auth/forgotPassword";
export const AUTH_FORGOT_PASSWORD_ERROR =
  "Не удалось отправить новый пароль на ваш email";

// User
export const USER_GET_PROFILE = "/user";
export const USER_GET_PROFILE_ERROR = "Не удалось получить данные пользователя";

export const USER_GET_PROFILE_BY_ID = "/user/";
export const USER_GET_PROFILE_BY_ID_ERROR =
  "Не удалось получить данные выбранного пользователя";

export const USER_UPDATE = "/user/update";
export const USER_UPDATE_ERROR = "Не удалось обновить данные пользователя";

// Accidents
export const ACCIDENTS_GET_ALL = "/accidents/";
export const ACCIDENTS_GET_ALL_ERROR = "Не удалось получить список ДТП";

export const ACCIDENTS_GET_BY_ID = "/accidents/byId/";
export const ACCIDENTS_GET_BY_ID_ERROR = "Не удалось получить выбранное ДТП";

export const ACCIDENTS_GET_CURRENT = "/accidents/current";
export const ACCIDENTS_GET_CURRENT_ERROR =
  "Не удалось получить данные об активном ДТП";

export const ACCIDENTS_CREATE = "/accidents/create";
export const ACCIDENTS_CREATE_ERROR = "Не удалось создать запрос о помощи";

export const ACCIDENTS_CANCEL = "/accidents/cancel";
export const ACCIDENTS_CANCEL_ERROR = "Не удалось отменить запрос о помощи";

export const ACCIDENTS_HELP = "/accidents/help/";
export const ACCIDENTS_HELP_ERROR = "Не удалось отозваться на запрос о помощи";

// Chats
export const CHATS_GET_ALL = "/chats/";
export const CHATS_GET_ALL_ERROR = "Не удалось получить список чатов";

export const CHATS_GET_CHAT = "/chats/";
export const CHATS_GET_CHAT_ERROR = "Не удалось получить чат";
