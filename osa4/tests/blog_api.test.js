const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const connectUserToBlogs = async () => {

  const user = await helper.singleUser()
  const blogs = await helper.blogsInDb()

  user.blogs = blogs.map(b => b.id)
  user.save()
  await Blog.updateMany({}, { $set: { user: user._id } })
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
  await User.insertMany(helper.initialUsers)

  await connectUserToBlogs()
  /*const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  //taulukollinen promiseja yhdeksi promiseksi
  //odottaa, että kaikki tietokantaan talletetusta vastaavat promiset ovat valmiina
  await Promise.all(promiseArray)*/
})


describe('Getting notes', () => {
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
})


test('the unique identifier property of the blogs is called id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

describe('adding a blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'AFakeBlog',
      author: 'Kayt Taja',
      url: 'https://..../home',
      likes: 8
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${await helper.getToken()}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('AFakeBlog')
  })


  test('cannot add a blog with missing title and url properties', async () => {
    const noURL = {
      title: 'Not A Blog Sadly',
      author: 'Kayt Taja',
      likes: 67
    }

    await api.post('/api/blogs')
      .send(noURL)
      .set('Authorization', `bearer ${await helper.getToken()}`)
      .expect(400)

    const noTitle = {
      author: 'Kayt Taja',
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
      author: 'Kayt Taja',
      url: 'https://itsashamenoonelikedthis.org'
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .set('Authorization', `bearer ${await helper.getToken()}`)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
    expect(lastBlog.likes).toBe(0)
  })

  test('unauthorized cannot add', async () => {
    const newBlog = {
      title: 'No Likes Sadly',
      author: 'ei ei ',
      url: 'https://itsashamenoonelikedthis.org'
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

})

describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${ blogToDelete.id }`)
      .set('Authorization', `bearer ${await helper.getToken()}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length)
      .toBe(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})