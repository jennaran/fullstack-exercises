import React from 'react'

const Search = ({value, onChange}) => {
  return(
    <div>
      filter show with <input value = {value} onChange={onChange} />
    </div>
  )
}

export default Search