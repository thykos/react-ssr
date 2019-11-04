import axios from 'axios';
import configs from 'constants/parameters';

const methods = ['get', 'post', 'put', 'patch', 'delete'];
const instance = axios.create();
instance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error.response && error.response.data ? error.response.data : error)
);

export class Client {
  constructor() {
    methods.forEach(method => // eslint-disable-line
      this[method] = (
        path,
        { data = {}, params = {} } = {},
      ) => ({
        url: configs.api_url,
        method,
        data,
        params
      }));
  }
}

const client = new Client();

export default client;
