import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  )

const Header = props => <h1>{props.text}</h1>

const Anecdote = (props) => <p>{props.anecdotes[props.value]}</p>

const Result = (props) => <p>Has {props.points[props.value]} votes</p>

const Content = (props) => {
  return (
    <div>
      <Header text = {props.text} />
      <Anecdote anecdotes = {props.anecdotes} value = {props.value} />
      <Result points = {props.points} value = {props.value}  />
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0,0,0,0,0,0])
  const [popular, setPopular] = useState(0)

  const selectRandom = () => setSelected(Math.floor(Math.random()*6))

  const addVote = () => {
    const t = {...points}
    t[selected] += 1
    setPoints(t)
  }

  if (points[selected] > points[popular]) {
    setPopular(selected)
  }

  return (
    <div>
      <Content 
        text = "Anecdote of the Day"
        anecdotes = {anecdotes}
        value = {selected}
        points = {points}
      />
      <Button handleClick = {() => addVote()} text = "Vote" />
      <Button handleClick = {() => selectRandom()} text = "Next anecdote" />
      <Content 
        text = "Anecdote with Most Votes"
        anecdotes = {anecdotes}
        value = {popular}
        points = {points}
      />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)