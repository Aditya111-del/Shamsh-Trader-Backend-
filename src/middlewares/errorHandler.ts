import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface ErrorResponse {
  message: string;
  stack?: string;
  errors?: any;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  if (err instanceof ZodError) {
    res.status(400);
    res.json({
      message: 'Validation failed',
      errors: err.issues,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
    return;
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
