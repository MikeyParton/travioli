import express from 'express';
import Joi from '@hapi/joi';
import asyncErrorCatcher from '../errors/asyncErrorCatcher';
import {
  getPricesSessionKey,
  getPricesResults
} from '../services/skyScanner';

const router = express.Router();

const pricesSchema = Joi.object().keys({
  originPlace: Joi.string().required(),
  destinationPlace: Joi.string().required(),
  outboundDate: Joi.string().required(),
  inboundDate: Joi.string(),
  adults: Joi.number().min(1).required()
});

router.post('/prices', asyncErrorCatcher(async (req, res) => {
  const validation = pricesSchema.validate(req.body)
  if (validation.error) {
    throw new Error(validation.error?.message);
  }

  const sessionKey = await getPricesSessionKey(req.body);
  res.json({ sessionKey });
}));

router.get('/prices', asyncErrorCatcher(async (req, res) => {
  const { sessionKey } = req.query;
  const prices = await getPricesResults({ sessionKey });
  res.json(prices);
}));

export default router;
