const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany()

  const userObjects = helper.initialUsers
    .map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  //taulukollinen promiseja yhdeksi promiseksi
  //odottaa, että kaikki tietokantaan talletetusta vastaavat promiset ovat valmiina
  await Promise.all(promiseArray)
})

describe('Getting users', () => {
  test('users returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body.length).toBe(helper.initialUsers.length)
  })
})

describe('Adding a user', () => {
  test('valid user can be added', async () => {
    const newUser = {
      username: 'testi1',
      password: 'salainen',
      name: 'Testi Henkilo'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(helper.initialUsers.length +1 )

    const contents = usersAtEnd.map(u => u.username)
    expect(contents).toContain('testi1')
  })


  test('cannot add a user with no password or with too short password', async () => {
    const noPassword = {
      username: 'testi1',
      name: 'Testi Henkilo',
      password: ''
    }

    await api.post('/api/users')
      .send(noPassword)
      .expect(400)

    noPassword.password = 'ue'
    await api.post('/api/users')
      .send(noPassword)
      .expect(400)
  })


  test('cannot add a user with no username or too short password', async () => {
    const noUsername = {
      username: '',
      name: 'Testi Jeejee',
      password: 'joou'
    }

    await api.post('/api/users')
      .send(noUsername)
      .expect(400)

    noUsername.username = 'uu'
    await api.post('/api/users')
      .send(noUsername)
      .expect(400)
  })


  test.only('username needs to be unique', async () => {
    const newUser = helper.initialUsers[0]
    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})