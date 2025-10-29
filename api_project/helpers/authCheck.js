

function isSuccessfulAuth(response) {
    return (
      response.status === 200 &&
      response.data?.token &&
      typeof response.data.token === 'string' &&
      response.data.token.length > 0
    );
  }

  function isFailedAuth(response, expectedReason = 'Bad credentials') {
    return (
      response.status === 200 &&
      response.data?.reason === expectedReason
    );
  }

module.exports = {
    isSuccessfulAuth,
    isFailedAuth
};  