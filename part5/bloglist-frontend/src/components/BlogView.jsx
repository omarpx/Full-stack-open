import { useNavigate } from 'react-router-dom'
import { Button, Typography, Box, Paper } from '@mui/material'

const BlogView = ({ blog, updateBlog, removeBlog, user }) => {
  const navigate = useNavigate()

  if (!blog) return null

  const handleLike = () => {
    const updatedBlog = {
      user: blog.user ? blog.user.id : null,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await removeBlog(blog.id)
      navigate('/')
    }
  }

  const blogBelongsToUser = user && blog.user && blog.user.username === user.username

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h4">{blog.title} by {blog.author}</Typography>
      <Box style={{ marginTop: 10 }}>
        <Typography><a href={blog.url}>{blog.url}</a></Typography>
        <Typography>likes {blog.likes || 0}
          {user && <Button size="small" variant="outlined" onClick={handleLike} style={{ marginLeft: 10 }}>like</Button>}
        </Typography>
        <Typography>added by {blog.user && blog.user.name}</Typography>
        {blogBelongsToUser &&
          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginTop: 10 }}>
            remove
          </Button>
        }
      </Box>
    </Paper>
  )
}

export default BlogView