const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[5])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})


test('the unique identifier property of the blogs is called id', async () => {
  const response = await api.get('/api/blogs')
  //vaihda response.body.foreach
  console.log('res.body',response.body)
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'AFakeBlog',
    author: 'Just Someone',
    url: 'https://..../home',
    likes: 8
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain('AFakeBlog')
})


test.only('cannot add a blog with missing title and url properties', async () => {
  const noURL = {
    title: 'Not A Blog Sadly',
    author: 'Not A Blogger',
    likes: 67
  }

  await api.post('/api/blogs')
    .send(noURL)
    .expect(400)

  const noTitle = {
    author: 'Not A Blogger',
    url: 'https://itsashamethisisnotablog.org',
    likes: 67
  }

  await api.post('/api/blogs')
    .send(noTitle)
    .expect(400)
})


test('blog with no likes can be added => the nbr of likes is set 0', async () => {
  const newBlog = {
    title: 'No Likes Sadly',
    author: 'Unliked person',
    url: 'https://itsashamenoonelikedthis.org'
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
  expect(lastBlog.likes).toBe(0)
})


afterAll(() => {
  mongoose.connection.close()
})