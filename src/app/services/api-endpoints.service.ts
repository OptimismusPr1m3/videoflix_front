import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointsService {
/*google cloud server */
  // USERS_API = 'http://storage.bastian-wolff.com/api/users/';
  // REGISTER = 'http://storage.bastian-wolff.com/api/accounts/signup/';
  // LOGIN = 'http://storage.bastian-wolff.com/api/accounts/login/';
  // LOGOUT = 'http://storage.bastian-wolff.com/api/accounts/logout/';
  // RESET_PASSWORD = 'http://storage.bastian-wolff.com/api/accounts/password/reset/';
  // USER_ME = 'http://storage.bastian-wolff.com/api/accounts/users/me/';

/*raspberry pie */
  USERS_API = 'https://bepi.bastian-wolff.com/api/users/';
  REGISTER = 'https://bepi.bastian-wolff.com/api/accounts/signup/';
  // LOGIN = 'https://bepi.bastian-wolff.com/api/accounts/login/';
  LOGIN = 'https://bepi.bastian-wolff.com/api/accounts/auth/login/';
  LOGOUT = 'https://bepi.bastian-wolff.com/api/accounts/logout/';
  RESET_PASSWORD = 'https://bepi.bastian-wolff.com/api/accounts/password/reset/';
  USER_ME = 'https://bepi.bastian-wolff.com/api/accounts/users/me/';
  VIDEO_ITEMS = 'https://bepi.bastian-wolff.com/api/videos/';
  CHANGE_USER_ME = 'https://bepi.bastian-wolff.com/api/accounts/users/me/change/';

  /*local*/
  // USERS_API = 'http://127.0.0.1:8000/api/users/';
  // REGISTER = 'http://127.0.0.1:8000/api/accounts/signup/';
  // LOGIN = 'http://127.0.0.1:8000/api/accounts/auth/login/';
  // LOGOUT = 'http://127.0.0.1:8000/api/accounts/logout/'
  // RESET_PASSWORD = 'http://127.0.0.1:8000/api/accounts/password/reset/'
  // VIDEO_ITEMS = 'http://127.0.0.1:8000/api/videos/'
  // CHANGE_USER_ME = 'http://127.0.0.1:8000/api/accounts/users/me/change/'
  // USER_ME = 'http://127.0.0.1:8000/api/accounts/users/me/'
  constructor() { }
}
