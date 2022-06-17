import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
// import logger from './api/middlewares/logger.middleware';
// import errorHandler from './api/middlewares/error-handler.middleware';
// import { generateToken } from './api/utils/jwt.utils';
// import routes from './api/routes';

import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = +process.env.PORT || 3000;

// Only generate a token for lower level environments
if (process.env.NODE_ENV !== 'production') {
//   console.log('JWT', generateToken());
}

// compresses all the responses
app.use(compression());

// adding set of security middlewares
app.use(helmet());

// parse incoming request body and append data to `req.body`
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable all CORS request
app.use(cors());

// add logger middleware
// app.use(logger);

// app.use(Auth.authorize([ALL_VALID_ACCESS_TYPES_IN_THE_APP]));

// app.use('/api/', routes);

// app.use(errorHandler);

app.get('/api', (req, res) => {
    res.status(202).send({
        message: 'Endpoint Running',
        env: process.env.PROJECT
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});