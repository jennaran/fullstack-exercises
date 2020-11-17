import React, { useState, useImperativeHandle } from 'react'
import Button from './Button'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button text={props.buttonLabel} action={toggleVisibility}/>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button text={'cancel'} action={toggleVisibility}/>
      </div>
    </div>
  )
})

export default Togglable 