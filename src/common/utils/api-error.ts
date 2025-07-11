import logger from './logger';
import { format } from 'date-fns';
import { httpResponse } from './http-response';

class ApiError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.message = message;

        logger.log({
            level: 'error',
            message: `[${format(new Date(), 'dd.MM.yyyy HH:mm')}] ${message}`,
        });

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            status: 'error',
            exception: null,
            message: this.message,
            tag: null,
            data: null,
        } as httpResponse;
    }
}

export default ApiError;
