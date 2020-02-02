import express from 'express';

const asyncErrorCatcher = (func: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch(err) {
      if (err.response && err.response.status) {
        res.status(err.response.status);
      }
      next(new Error(err));
    }
  }
};

export default asyncErrorCatcher;
