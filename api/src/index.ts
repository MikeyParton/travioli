import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from './errors/errorHandler';
import placesRoutes from './controllers/placesController';
import pricesRoutes from './controllers/pricesController';
import 'dotenv/config';

const app = express();
app
  .use(cors())
  .use(bodyParser.json());

app.use('/', placesRoutes);
app.use('/', pricesRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, (): void => {
  console.log(`api is running on ${process.env.PORT}`);
});
