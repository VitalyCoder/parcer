import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/api-error';
import { httpResponse } from '../utils/http-response';
import logger from '../utils/logger';
import { format } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    const response: httpResponse = {
        status: 'error',
        exception: err.name || 'Error',
        message: err.message || 'An unexpected error occurred',
        tag: null,
        data: null,
    };

    logger.log({
        level: 'error',
        message: `[${format(new Date(), 'dd.MM.yyyy HH:mm')}] [${err.name}] ${err.message}`,
    });
    console.log(err.stack);

    res.status(statusCode).json(response);
};
