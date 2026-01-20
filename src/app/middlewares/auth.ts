import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../utils/AppError';
import { userRole } from '../modules/users/user.constants';
import { verifyToken } from '../modules/auth/auth.utils';

const auth =
  (...roles: userRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (!tokenWithBearer) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }

      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
        const token = tokenWithBearer.split(' ')[1];
        
        //verify token
        const verifyUser = verifyToken(
          token,
          config.jwt_access_secret as string
        );
        //set user to header
        req.user = verifyUser;

        //guard user
        if (roles.length && !roles.includes(verifyUser.role)) {
          throw new AppError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this api"
          );
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default auth;
