import { apiClient } from "../../libs/api-client";



type LoginInput = {
  email: string,
  password: string,
}

export class AuthApi {
  static async login({}:LoginInput ) {
    return apiClient.post<{}>('/auth/login', {
      email,
      password,
      // fingerprint: await fingerprint,
    });

    // const data = fetch('http://localhost:5000/api/auth/login', {
    //   method: 'Post',
    //   credentials: 'include',
    //   mode: 'cors',
    //   headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //   },
    //   body: JSON.stringify({ email, password }),
    // });
    // return data.then(response => response.json());
  }

  static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/users', { email, password });
  }
