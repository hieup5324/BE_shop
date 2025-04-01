import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log(3);
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
