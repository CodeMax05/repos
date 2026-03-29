import { useState } from 'react'
import './App.css'

const ACCESS_KEY = import.meta.env.VITE_DOG_ACCESS_KEY;

function App() {

  const callAPIBreeds = async () => {

    const response = await fetch("https://api.thedogapi.com/v1/breeds", {
      headers: {
        "x-api-key": ACCESS_KEY
      }
    });
    const data = await response.json()
    if (data == null){
      alert("Could not get data!")
    }
    else [
      console.log(data)
    ]
  }

  const callAPISearch = async () => {
    const response = await fetch("https://api.thedogapi.com/v1/images/search?limit=3", {
      headers: {
        "x-api-key": ACCESS_KEY
      }
    })
  }
  
  return (
    <div className='doggy-page'>
      <h1>Veni Vici!</h1>
      <h3>Discover the wonderful world of Dogs!!!</h3>

      <button onClick={callAPIBreeds}>Discover</button>
    </div>
  )
}

export default App
