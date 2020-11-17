import React, { useState } from 'react'
import Button from './Button'

const Blog = ({ blog, handleLike, username, handleDelete }) => {
  const [detailed, setDetailed] = useState(false)
  

  


  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetailed = () => {
    setDetailed(!detailed)
  }

  return detailed ?
  <div style={blogStyle}>
    <div>Title: {blog.title} <Button text={'hide'} action={toggleDetailed}/></div>
    <div>URL: {blog.url}</div>
    <div>Likes: {blog.likes} <Button text={'like'} action={() => handleLike(blog)}/></div>
    <div>Author: {blog.author}</div>
    {
    blog.user ?
    blog.user.username === username ?
      <Button text={'remove'} action={() => handleDelete(blog)}/> :
      null :
    null
    }
  </div> :
  <div style={blogStyle}>
    {blog.title} <Button text={'view'} action={toggleDetailed}/>
  </div>
}

export default Blog
