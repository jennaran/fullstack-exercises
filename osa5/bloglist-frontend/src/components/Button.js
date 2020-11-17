import React from 'react'

const Button = ({text, action}) => (
<button onClick={action}>
  {text}
</button>
)

export default Button