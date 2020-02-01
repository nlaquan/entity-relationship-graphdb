import axios from 'axios';

const domain = 'http://192.168.25.104:3001';
const baseURL = `${domain}/er-services`;

const api = axios.create({
  baseURL
});

export {
  api,
  domain,
  baseURL
}
