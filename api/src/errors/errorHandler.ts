import express from 'express';

const errorHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  res.status(res.statusCode >= 400 ? res.statusCode : 500)
     .json({ message: error.message });
};

export default errorHandler;
