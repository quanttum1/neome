type JwtToken = string;

interface LoginStore {
  token: JwtToken | undefined;
  setToken: (newToken: JwtToken | undefined) => void;
}
