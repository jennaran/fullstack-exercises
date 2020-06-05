import React from 'react'


const Header = ({ course }) => {
    return (
        <h2>{course.name}</h2>
    )
  }
  
  const Total = ({ parts }) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sum = parts.map(part => part.exercises).reduce(reducer)
    return (
       <b> Total of {sum} exercises</b>
   )
  }
  
  const Part = ({part}) => {
    return (
        <p>{part.name} {part.exercises}</p> 
    )
  }
  
  const Content = ({ parts }) => {
  
    return (
      <div>
        {parts.map(part => (
          <Part key={part.id} part={part} />
        ))}
      </div>
    )
  
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  export default Course