import React from 'react'
import './Navbar.css'
function Navbar() {

  const show=[
    {
      name:'All'
    },
    {
      name:'Music'
    },
    {
      name:'Comedy'
    },
    {
      name:'Mixes'
    },
    {
      name:'Bollywood'
    },
    {
      name:'Gaming'
    },
    {
      name:'JavaScript'
    },
    {
      name:'React'
    },
  ]
  return (
    <nav>
      {show.map((element)=>(
        <div className='nav-options' key={element.name}>{element.name}</div>
      ))}
    </nav>
  )
}

export default Navbar