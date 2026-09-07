import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user ? blog.user.id : null,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    updateBlog(returnedBlog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      removeBlog(blog.id)
    }
  }

  const blogBelongsToUser = user && blog.user && blog.user.username === user.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user && blog.user.name}</div>
          {blogBelongsToUser && <button onClick={handleDelete}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog