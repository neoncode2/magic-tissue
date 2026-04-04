function getErrorMessage(error, fallback = 'Unexpected server error') {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function isMongoAuthError(error) {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('bad auth') || message.includes('authentication failed');
}

function serverErrorResponse(message, error, status = 500) {
  const mongoAuthError = isMongoAuthError(error);
  const normalizedMessage = mongoAuthError
    ? 'MongoDB login failed. Check Atlas username, password, and database access.'
    : message;

  return Response.json(
    {
      error: normalizedMessage,
      details: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined,
    },
    { status: mongoAuthError ? 503 : status }
  );
}

export { getErrorMessage, isMongoAuthError, serverErrorResponse };
