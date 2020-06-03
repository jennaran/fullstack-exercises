import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = props => <h1>{props.text}</h1>


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  )

const StatisticLine = (props) => {
  if (props.text === "Positive:") {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}%</td>
      </tr>
    )
  }
  return (
    <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.allValue === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <table>
        <tbody>
        <StatisticLine text = {props.good} value = {props.goodValue}/>
        <StatisticLine text = {props.neutral} value = {props.neutralValue}/>
        <StatisticLine text = {props.bad} value = {props.badValue}/>
        <StatisticLine text = {props.all} value = {props.allValue}/>
        <StatisticLine text = {props.avarage} value = {props.avarageValue}/>
        <StatisticLine text = {props.positive} value = {props.positiveValue}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad

  const setToGood = () => setGood(good + 1)
  const setToNeutral = () => setNeutral(neutral + 1)
  const setToBad = () => setBad(bad + 1)


  return (
    <div>
      <Header text = "Give feedback" />
      <Button handleClick = {() => setToGood()} text = "Good" />
      <Button handleClick = {() => setToNeutral()} text = "Neutral" />
      <Button handleClick = {() => setToBad()} text = "Bad" />
      <Header text = "Statistics" />


      <Statistics 
        good = "Good:" 
        goodValue = {good} 
        neutral = "Neutral:" 
        neutralValue = {neutral}
        bad = "Bad:" badValue = {bad}
        all = "All:" allValue = {all} 
        avarage = "Avarage:" avarageValue = {(good - bad) / all}
        positive = "Positive:" positiveValue = {100 * (good / all)}
      />
      
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)