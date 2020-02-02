import express from 'express';
import Joi from '@hapi/joi';
import asyncErrorCatcher from '../errors/asyncErrorCatcher';
import { getPlaces } from '../services/skyScanner';

const router = express.Router();

const placeSchema = Joi.object().keys({
  query: Joi.string().required()
});

router.get('/places', asyncErrorCatcher(async (req, res) => {
  const { query } = req.query;
  const validation = placeSchema.validate(req.query)
  if (validation.error) {
    throw new Error(validation.error?.message);
  }

  const places = await getPlaces({ query });
  res.json(places);
}));

export default router;
