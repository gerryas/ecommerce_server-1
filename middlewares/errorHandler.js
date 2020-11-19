const errorHandler = (err, req, res, next) => {
  const name = err.name || '';
  let status, error;
  console.log(err);
  
  switch (name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      status = 400;
      error = err.errors.map(el => el.message).join(',');
      break;
    case 'InvalidUserPassword':
      status = 400;
      error = 'Invalid Email or Password';
      break;
    case 'AuthenticationFailed':
      status = 401;
      error = "You don't have access to do that";
      break;
    case 'AuthorizationFailed':
      status = 403;
      error = "You don't have access to do that";
      break;
    case 'NotFound':
      status = 404;
      error = 'Error Not Found';
      break;
    case 'Error':
      status = 400;
      error = err.message;
      break;
    default:
      status = 500;
      error = 'Internal server error';
  }

  res.status(status).json({
    error
  });

}

module.exports = errorHandler;