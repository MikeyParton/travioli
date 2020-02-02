import axios from 'axios';
import qs from 'querystring';

const COUNTRY = 'AU';
const CURRENCY = 'AUD';
const LOCALE = 'en-AU';

const instance = axios.create({
  baseURL: process.env.FLIGHTS_API_BASE,
  headers: {
    'RapidAPI-Project': process.env.FLIGHTS_API_PROJECT,
    'x-rapidapi-host': process.env.FLIGHTS_API_HOST,
    'x-rapidapi-key': process.env.FLIGHTS_API_KEY
  }
});

export interface GetPlacesParams {
  query: string;
}

export type Place = {
  PlaceId: string,
  PlaceName: string,
  CountryId: string,
  RegionId: string,
  CityId: string,
  CountryName: string
}

export const getPlaces = async ({ query }: GetPlacesParams): Promise<Place[]> => {
  const response = await instance.get<Place[]>(`/autosuggest/v1.0/${COUNTRY}/${CURRENCY}/${LOCALE}/`, {
    headers: { 'content-type': 'application/octet-stream' },
    params: {
      query
    }
  });
  return response.data;
}

export interface GetPricesSessionKey {
  originPlace: string;
  destinationPlace: string;
  outboundDate: string;
  inboundDate?: string;
  adults: number;
}

export const getPricesSessionKey = async (params: GetPricesSessionKey): Promise<string> => {
  const data = qs.stringify({
    country: COUNTRY,
    currency: CURRENCY,
    locale: LOCALE,
    groupPricing: true,
    ...params
  });

  const headers = { 'content-type': 'application/x-www-form-urlencoded' };
  const response = await instance.post(`/pricing/v1.0`, data, { headers });
  const locationUrl: string[] = response.headers.location.split('/');
  return locationUrl[locationUrl.length - 1];
};

export interface GetPricesResultsParams {
  sessionKey: string;
}

// TODO add type for livePricesResults
export const getPricesResults = async (params: GetPricesResultsParams) => {
  const { sessionKey } = params;
  const response = await instance.get(`/pricing/uk2/v1.0/${sessionKey}`, {
    params: {
      pageIndex: 0,
      pageSize: 10
    }
  });

  return response.data;
};
