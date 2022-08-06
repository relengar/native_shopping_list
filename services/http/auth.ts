import {HttpClient} from '.';

type LoginResponse = {
  token: string;
  id: string;
};

export interface AuthHttpClientInterface {
  setToken(token: string | null): void;
  login(username: string, password: string): Promise<LoginResponse>;
  logout(): Promise<null>;
  getCurrentUser(): Promise<{id: string; username: string}>;
  register(username: string, password: string): Promise<LoginResponse>;
}

export class AuthClient extends HttpClient implements AuthHttpClientInterface {
  public login(username: string, password: string): Promise<LoginResponse> {
    return this.request('/user/login', 'POST', {
      username,
      password,
    });
  }

  public async logout(): Promise<null> {
    return this.request('/user/logout');
  }

  public getCurrentUser(): Promise<{id: string; username: string}> {
    return this.request('/user/current');
  }

  public register(username: string, password: string): Promise<LoginResponse> {
    return this.request('/user', 'POST', {
      username,
      password,
    });
  }

  public setToken(token: string | null): void {
    this.token = token;
  }
}

export default new AuthClient();
