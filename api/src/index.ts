import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const COUNTRY = 'AU';
const CURRENCY = 'AUD';
const LOCALE = 'en-AU';

const instance = axios.create({
  baseURL: process.env.FLIGHTS_API_BASE,
  headers: {
    'content-type': 'application/octet-stream',
    'RapidAPI-Project': process.env.FLIGHTS_API_PROJECT,
    'x-rapidapi-host': process.env.FLIGHTS_API_HOST,
    'x-rapidapi-key': process.env.FLIGHTS_API_KEY
  }
});

const app = express();
app.use(cors());

app.get('/', async (req, res): Promise<void> => {
  try {
    const data = await instance.get(`/autosuggest/v1.0/${COUNTRY}/${CURRENCY}/${LOCALE}/`, {
      params: {
        query: req.query.query
      }
    });
    res.json(data.data);
  } catch(err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, (): void => {
  console.log(`api is running on ${process.env.PORT}`);
});
