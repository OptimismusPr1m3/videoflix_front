import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointsService {

  USERS_API = 'http://storage.bastian-wolff.com/api/users/';
  REGISTER = 'http://storage.bastian-wolff.com/api/accounts/signup/';
  LOGIN = 'http://storage.bastian-wolff.com/api/accounts/login/';
  LOGOUT = 'http://storage.bastian-wolff.com/api/accounts/logout/';
  RESET_PASSWORD = 'http://storage.bastian-wolff.com/api/accounts/password/reset/';
  USER_ME = 'http://storage.bastian-wolff.com/api/accounts/users/me/';

  // USERS_API = 'http://127.0.0.1:8000/api/users/';
  // REGISTER = 'http://127.0.0.1:8000/api/accounts/signup/';
  // LOGIN = 'http://127.0.0.1:8000/api/accounts/login/';
  // RESET_PASSWORD = 'http://127.0.0.1:8000/api/accounts/password/reset/'

  constructor() { }
}
