import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { validateTokenKey } from './../utils/jwt.utils';
import asyncHandler from "express-async-handler"
import { AuthorizationError, AuthenticationError, ServerError, CustomError } from '../models/custom-error.model';

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
const authorizeKey = (allowedAccessTypes: string[]) => asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let jwt = req.headers.authorization;

    // verify request has token
    if (!jwt) {
      throw new AuthenticationError('Invalid token');
    }

    // remove Bearer if using Bearer Authorization mechanism
    if (jwt.toLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }

    // verify token hasn't expired yet
    const decodedToken = await validateTokenKey(jwt);

    const hasAccessToEndpoint = allowedAccessTypes.some(
      (at) => decodedToken.accessTypes.some((uat) => uat === at)
    );

    if (!hasAccessToEndpoint) {
      throw new AuthorizationError('No enough privileges to access endpoint');
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Expired token');
    } 

    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }

    if (error instanceof CustomError) {
      throw error;
    }
    
    throw new ServerError(error.message);
  }
});

const authorizeSecret = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = verify(token, process.env.JWT_SECRET)
      console.log(decoded);
      next()
    } catch (error) {
      throw new AuthenticationError('Not authorized')
    }
  }

  if (!token) {
    throw new AuthenticationError('Not authorized, no token')
  }
})

export { authorizeKey, authorizeSecret };
