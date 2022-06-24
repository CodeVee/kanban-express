import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';


/**
 * generates JWT used for local testing
 */
const generateTokenKey = (): string => {
  // information to be encoded in the JWT
  const payload = {
    name: 'Victor Onyebuchi',
    userId: 123,
    accessTypes: [
      'getTeams',
      'addTeams',
      'updateTeams',
      'deleteTeams'
    ]
  };
  // read private key value
  const privateKey = {
    key: fs.readFileSync(path.join(__dirname, './../../../private.key')),
    passphrase: process.env.PASS_PHRASE
  }

  const signInOptions: SignOptions = {
    // RS256 uses a public/private key pair. The API provides the private key
    // to generate the JWT. The client gets a public key to validate the
    // signature
    algorithm: 'RS256',
    expiresIn: '1h'
  };
  // generate JWT
  return sign(payload, privateKey, signInOptions);
};

interface TokenPayload {
  exp: number;
  accessTypes: string[];
  name: string;
  userId: number;
}

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
const validateTokenKey = (token: string): Promise<TokenPayload> => {
  const publicKey = fs.readFileSync(path.join(__dirname, './../../../public.key'));

  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };

  return new Promise((resolve, reject) => {
    verify(token, publicKey, verifyOptions, (error, decoded: TokenPayload) => {
      if (error) return reject(error);

      resolve(decoded);
    })
  });
}

/**
 * 
 * @param id the user Id
 * @returns JWT Token as string
 */
const generateTokenSecret = (id: string): string => sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export { generateTokenKey, generateTokenSecret, validateTokenKey }