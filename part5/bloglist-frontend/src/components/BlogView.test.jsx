import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogView from './BlogView'

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

test('shows blog details but no buttons when user is not logged in', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={null} />
    </MemoryRouter>
  )

  screen.getByText('Test Blog Title', { exact: false })
  screen.getByText('http://testurl.com')
  screen.getByText('likes 5', { exact: false })

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('shows like button but not remove button for non-owner', () => {
  const otherUser = { username: 'otheruser', name: 'Other User' }

  render(
    <MemoryRouter>
      <BlogView blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={otherUser} />
    </MemoryRouter>
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('shows remove button for the blog owner', () => {
  const owner = { username: 'testuser', name: 'Test User' }

  render(
    <MemoryRouter>
      <BlogView blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={owner} />
    </MemoryRouter>
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
})