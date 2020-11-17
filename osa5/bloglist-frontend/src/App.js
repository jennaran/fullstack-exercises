import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import User from './components/User'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'


const App = () => {
//  const [createVisible, setCreateVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("message")
  const blogFormRef = useRef()

  //käyttäjä pysyy kirjautuneena
  useEffect(() => {
    async function getBlogs() {
      const blogs = await blogService.getAll()
      //eniten likes -> vähiten likes
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')    
    if (loggedUserJSON) { 
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)
    }

    getBlogs() 
  }, [])


  const notify = (message, type) => {
    setMessage(message)
      setMessageType(type)
      setTimeout(() => {
        setMessage(null)
      }, 3000);
  }



  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      //storageen voi lisätä vain merkkijonoja
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch {
      notify('wrong username or password', "error")
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogappUser')

      setUser(null)
      setUsername('')
      setPassword('')
    } catch {
      console.log('failed to log out')
    }
  }

  const handlePost = async (blog) => {
    //piilottaa lomakkeen uuden blogin luonnin yhteydessä
    blogFormRef.current.toggleVisibility()

    try {
      const newBlog = await blogService.create(blog)

      setBlogs(blogs.concat(newBlog))
      notify('Blog added', "message")
    } catch {
      notify('could not add the blog', "error")
    }
  }

  const handleLike = async (blog) => {
    const likedBlog = { likes: blog.likes + 1 } 
    try {
      const updatedBlog = await blogService.update(blog.id, likedBlog)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? {...blog, likes: updatedBlog.likes} : blog))
      notify('Like added', "message")
    } catch {
      notify('could not like the blog', "error")
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} bt ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify('Blog removed', 'message')
      } catch {
        notify('Could not remove the blog', 'error')
      }
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
      <BlogForm 
        createBlog={handlePost}
      />
    </Togglable>
  )
  
  return (
    <div>
      <Notification message={message} type={messageType} />
      { user === null
        ? <LoginForm 
            handleLogin={handleLogin} 
            username={username} 
            handleUsernameChange={({ target }) => setUsername(target.value)} 
            password={password} 
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
        : <div>
            <h2>Blogs</h2>
            <User name={user.name} onLogout={handleLogout}/>
            { blogForm() }
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} handleLike={handleLike} username={user.username} handleDelete={handleDelete} />
            )}
          </div> 
      }
    </div>
  )
}

export default App