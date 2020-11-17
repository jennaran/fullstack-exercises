import React from 'react'
import Button from './Button'

const User = ({name, onLogout}) => (
  <div>
    { name } logged in <Button text={'logout'} action={onLogout}/>
  </div>
)

export default User 