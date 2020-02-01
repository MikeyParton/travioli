import express from 'express';
import bodyParser from 'body-parser';
import qs from 'querystring';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

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

const app = express();
app
  .use(cors())
  .use(bodyParser.json());

app.get('/places', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { query } = req.query;
    const data = await instance.get(`/autosuggest/v1.0/${COUNTRY}/${CURRENCY}/${LOCALE}/`, {
      headers: { 'content-type': 'application/octet-stream' },
      params: {
        query
      }
    });
    res.json(data.data);
  } catch(err) {
    next(new Error(err));
  }
});

app.post('/prices', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { originPlace, destinationPlace, outboundDate, inboundDate, adults } = req.body;
    const data = qs.stringify({
      country: COUNTRY,
      currency: CURRENCY,
      locale: LOCALE,
      groupPricing: true,
      originPlace,
      destinationPlace,
      outboundDate,
      inboundDate,
      adults
    });

    // Create session
    const sessionResponse = await instance.post(`/pricing/v1.0`, data,
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
    });

    const locationUrl = sessionResponse.headers.location.split('/');
    const sessionKey = locationUrl[locationUrl.length - 1];
    res.json({ sessionKey });
  } catch(err){
    next(new Error(err));
  }
});

app.get('/prices', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { sessionKey } = req.query;
    const response = await instance.get(`/pricing/uk2/v1.0/${sessionKey}`, {
      params: {
        pageIndex: 0,
        pageSize: 10
      }
    });
    res.json(response.data);
  } catch(err) {
    next(new Error(err));
  }
});

// Error middleware
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.json({ status: 500, message: error.message });
});

app.listen(process.env.PORT, (): void => {
  console.log(`api is running on ${process.env.PORT}`);
});
