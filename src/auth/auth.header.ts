import { Request as ExpressRequest } from 'express';
import { User } from 'src/users/users.model';

export interface Request extends ExpressRequest {
  user: User;
  headers: {
    authorization: string;
  };
}

export class AuthHeader {
  constructor(private request: Request) {}

  getValidToken(): string {
    const authHeader = this.request.headers.authorization;

    const isBearer = this.isBearer(authHeader, 'Bearer');
    const token = this.getToken(authHeader);

    if (!isBearer || !token) {
      return '';
    }

    return token;
  }

  private isBearer(authHeader: string, typeToken: string): boolean {
    return authHeader.split(' ')[0] === typeToken;
  }

  private getToken(authHeader: string): string {
    return authHeader.split(' ')[1];
  }
}
