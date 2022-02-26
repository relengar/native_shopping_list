import {HttpClient} from '.';

type LoginResponse = {
  token: string;
  id: string;
};

class AuthClient extends HttpClient {
  public login(username: string, password: string): Promise<LoginResponse> {
    return this.request('/user/login', 'POST', {
      username,
      password,
    });
  }

  public async logout(): Promise<null> {
    return this.request('/user/logout');
  }
}

export default new AuthClient({
  // TODO load deafault values from env config - during build
  baseURL: 'http://192.168.0.201:3030',
});
