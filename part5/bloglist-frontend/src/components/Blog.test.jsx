import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
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

  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={{ username: 'testuser' }} />)

  screen.getByText('Test Blog Title', { exact: false })
  screen.getByText('Test Author', { exact: false })

  const url = screen.queryByText('http://testurl.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 5')
  expect(likes).toBeNull()
})

test('shows url, likes and user after clicking view button', async () => {
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

  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={{ username: 'testuser' }} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('http://testurl.com')
  screen.getByText('likes 5', { exact: false })
  screen.getByText('Test User')
})

test('clicking like button twice calls event handler twice', async () => {
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

  const mockUpdateBlog = vi.fn()

  render(<Blog blog={blog} updateBlog={mockUpdateBlog} removeBlog={() => {}} user={{ username: 'testuser' }} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdateBlog.mock.calls).toHaveLength(2)
})