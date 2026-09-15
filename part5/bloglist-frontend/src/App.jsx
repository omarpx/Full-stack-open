import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useMatch } from 'react-router-dom'
import { AppBar, Toolbar, Button, Container, Alert } from '@mui/material'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import CreateBlog from './components/CreateBlog'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorType('error')
      setErrorMessage('wrong username/password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    await blogService.create(blogObject)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs)
    setErrorType('success')
    setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const updateBlog = async (id, updatedBlog) => {
    await blogService.update(id, updatedBlog)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs)
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create">create new blog</Button>}
          {user
            ? <span style={{ color: 'white', marginLeft: 'auto' }}>
                {user.name} logged in
                <Button color="inherit" onClick={handleLogout}>logout</Button>
              </span>
            : <Button color="inherit" component={Link} to="/login">login</Button>
          }
        </Toolbar>
      </AppBar>

      {errorMessage &&
        <Alert severity={errorType} style={{ marginTop: 10, marginBottom: 10 }}>
          {errorMessage}
        </Alert>
      }

      <Routes>
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />
        <Route path="/login" element={
          user ? <Navigate to="/" /> :
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        } />
        <Route path="/create" element={
          user ? <CreateBlog createBlog={createBlog} /> : <Navigate to="/login" />
        } />
        <Route path="/blogs/:id" element={
          <BlogView blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
        } />
      </Routes>
    </Container>
  )
}

export default App