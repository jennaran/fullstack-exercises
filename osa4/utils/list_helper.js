const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}


const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    return prev.likes > current.likes
      ? prev
      : current
  }
  return blogs.length === 0
    ? null
    : blogs.reduce(reducer)
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}