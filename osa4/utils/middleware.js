const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  request.token = ( authorization && authorization.toLowerCase().startsWith('bearer ' ))
    ? authorization.substring(7)
    : null

  next()
}

//tasrvitaan aina {} !!
module.exports = { tokenExtractor }