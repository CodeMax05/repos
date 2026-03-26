import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm'

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY

function App() {
  
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  })

  const [currentImage, setCurrentImage] = useState(null)
  const [prevImages, setPrevImages] = useState([])

  const callAPI = async (query) => {
    const response = await fetch(query)
    const json = await response.json()
    if (json.url == null) {
      alert("Could not get screenshot!")
    } else {
      setCurrentImage(json.url)
      reset();
    }
    
  }
  
  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    }

    if (inputs.url.trim() == "") {
      alert("Need an image URL!")
    } else {
      const updatedInputs = {...inputs};
      for (const [key, value] of Object.entries(inputs)) {
        if (value == "") {
          updatedInputs[key] = defaultValues[key]
        }
      }
      console.log(updatedInputs)
      setInputs(updatedInputs);
      makeQuery();
    }
  }
  
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);
  }

  const reset = () => {
    const updatedInputs = {...inputs}
    for (const [key, value] in Object.entries(inputs)) {
      updatedInputs[key] = ""
    }
    setInputs(updatedInputs)
  }
  
  return (
    <div className='whole-page'>
      <h1>Build Your Own Screenshot! 📸</h1>
    
    <APIForm
      inputs={inputs}
      handleChange={(e) =>
        setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value.trim(),
      }))
      }
      onSubmit={submitForm}
    />
    {currentImage ? (
      <img
        className="screenshot"
        scr={currentImage}
        alt="Screenshot returned"
        />
        
    ) : (
      <div></div>
    )}
    <div className='container'>
      <h3> Current Query Status: </h3>
      <p>
        https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
        <br></br>
        &url={inputs.url} <br></br>
        &format={inputs.format} <br></br>
        &width={inputs.width}
        <br></br>
        &height={inputs.height}
        <br></br>
        &no_cookie_banners={inputs.no_cookie_banners}
        <br></br>
        &no_ads={inputs.no_ads}
        <br></br>
      </p>
    </div>
    <br></br>
    
    </div>
  );
}

export default App
