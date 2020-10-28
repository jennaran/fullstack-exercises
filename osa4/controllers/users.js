const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users.map(user => user.toJSON()))
})


usersRouter.post('/', async (request, response) => {
  const body = request.body

  if ( !body.password ) {
    return response.status(400).json({ error: 'password required ' })
  } else if ( body.password.length < 3 ) {
    return response.status(400).json({ error: 'the password needs to be at least 3 marks' })
  } else if ( !body.username ) {
    return response.status(400).json({ error: 'username required' })
  } else if ( body.username.length < 3 ) {
    return response.status(400).json({ error: 'the username needs to be at least 3 marks' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    passwordHash,
    name: body.name,
  })

  const savedUser = await user.save()
  //  response.json(savedUser)
  response.json(savedUser.toJSON())
})

module.exports = usersRouter