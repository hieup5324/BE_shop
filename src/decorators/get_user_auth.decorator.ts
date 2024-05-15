import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const decodeUserFromHeader = (headers) => {
  const bearer = headers?.authorization;
  if (!bearer) {
    throw new ForbiddenException();
  }
  const payload = bearer.substring('Bearer '.length);

  return new JwtService().decode(payload, { json: true });
};

export const GetAuthUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (request) {
      return data ? request[data] : request.user;
    }

    try {
      return decodeUserFromHeader(request.headers);
    } catch (_) {
      return;
    }
  },
);
