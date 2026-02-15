import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = isHttpException ? exception.getResponse() : exception;

    const message = this.extractMessage(payload, exception);

    response.status(status).json({
      status: false,
      statusCode: status,
      message,
    });
  }

  private extractMessage(payload: unknown, exception: unknown): string {
    const fromPayload = this.getMessageFromPayload(payload);
    if (fromPayload) {
      return fromPayload;
    }

    if (exception instanceof Error && exception.message) {
      return this.cleanMessage(exception.message);
    }

    return 'Unexpected error';
  }

  private getMessageFromPayload(payload: unknown): string | undefined {
    if (!payload) {
      return undefined;
    }

    if (typeof payload === 'string') {
      return this.cleanMessage(payload);
    }

    if (typeof payload === 'object' && payload !== null) {
      const candidate = (payload as { message?: string | string[]; error?: string }).message;
      if (candidate) {
        if (Array.isArray(candidate)) {
          const first = candidate.find(
            (item) => typeof item === 'string' && item.trim().length > 0,
          );
          if (first) {
            return this.cleanMessage(first);
          }
        } else if (typeof candidate === 'string') {
          return this.cleanMessage(candidate);
        }
      }

      const error = (payload as { error?: string }).error;
      if (typeof error === 'string' && error.trim().length > 0) {
        return this.cleanMessage(error);
      }
    }

    return undefined;
  }

  private cleanMessage(message: string): string {
    return message.replace(/\s+/g, ' ').trim();
  }
}
