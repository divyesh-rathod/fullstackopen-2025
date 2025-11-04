const logger = require('./logger')
const jwt = require('jsonwebtoken')


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const authenticate = async (req,res,next) => {
  try {
       const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No valid token provided' });
            return;
        }
        const token = authHeader?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(400).json("Invalid Token")
    }
    req.user = decoded;

    next()
  } catch (error) {
     
        if (error instanceof jwt.JsonWebTokenError) {
          throw  logger.error('Invalid token');
        } else if (error instanceof jwt.TokenExpiredError) {
           throw logger.error('Token expired');
        } else {
           throw logger.error('Authentication error');
        }
  }

}



module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticate
}
