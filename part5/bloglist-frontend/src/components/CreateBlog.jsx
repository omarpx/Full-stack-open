import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateBlog = ({ createBlog }) => {
  const blogFormRef = useRef()
  const navigate = useNavigate()

  const handleCreate = async (blogObject) => {
    await createBlog(blogObject)
    navigate('/')
  }

  return (
    <div>
      <h2>create new blog</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreate} />
      </Togglable>
    </div>
  )
}

export default CreateBlog