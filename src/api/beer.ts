import axios from 'axios';
import { ApiParams } from '../types';
import { API } from './config';

const getBeer = (id: string) => axios.get(`${API}breweries/${id}`);

const getBeerList = (params?: ApiParams) =>
  axios.get(`${API}breweries/`, { params });

/**
 * @param size Int between 1 and 50. Default is 3.
 * @returns New promise with api call for random beer list.
 */
const getRandomBeerList = (size = 3, forceNoCacheKey?: string) =>
  axios.get(`${API}breweries/random`, {
    params: { size, forceNoCacheKey },
  });

const searchBeerList = (query: string, isAutoComplete = false) =>
  axios.get(`${API}breweries/${isAutoComplete ? 'autocomplete' : 'search'}`, {
    params: { query },
  });

const getBeerMetaData = (params?: ApiParams) =>
  axios.get(`${API}breweries/meta`, { params });

export {
  getBeer,
  getBeerList,
  getBeerMetaData,
  getRandomBeerList,
  searchBeerList,
};
