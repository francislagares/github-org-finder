import { NextFunction, Request, Response } from 'express';

type RouteHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

export const asyncMiddleware = <T>(routeHandler: RouteHandler<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
