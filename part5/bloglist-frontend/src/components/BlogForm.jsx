import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>title: <input placeholder="title" value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /></div>
      <div>author: <input placeholder="author" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /></div>
      <div>url: <input placeholder="url" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /></div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm