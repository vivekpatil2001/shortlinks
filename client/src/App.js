import React, { useEffect, useState } from 'react'
import "./App.css"
import Imgcopy from "./copy.png"
import axios from "axios";




function App() {

  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [links, setLinks] = useState([]);


  const generateLink = async () => {
    try {
      const response = await axios.post('/link', {
        url,
        slug
      });

      setShortUrl(response?.data?.data?.shortUrl)

    } catch (err) {
      console.log(err.message)
    }
  };


  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('linked copied')
  };

  const loadLinks = async () => {
    try {
      const response = await axios.get("/api/links");

      setLinks(response?.data?.data)
    }
    catch (err) {
      console.log(err.message)
    }
    console.log(loadLinks)
  }

  useEffect(() => {
    loadLinks()
  }, [])

  return (
    <div className='main-container'>
      <h1 className='text-center'>🔗Short Link🔗</h1>

      <div className='container'>
        <div className='link-generation-card'>
          <h2>Link Generation</h2>

          <input
            type='text'
            placeholder='url'
            value={url}
            className='input-box'
            onChange={(e) => {
              setUrl(e.target.value)
            }}
          />

          <input
            type='text'
            placeholder='slug(optional)'
            value={slug}
            className='input-box'
            onChange={(e) => {
              setSlug(e.target.value)
            }}
          />

          <div className='main-input-box-shortlink'>
            <input
              type='text'
              placeholder='short Url'
              className='input-box-short-link'
              value={shortUrl}
              disabled />

            <img
              src={Imgcopy}
              alt='copy'
              className='copy-img'
              height="20px"
              onClick={copyLink}
            />
          </div>

          <button
            type='button'
            className='btn-generate-link'
            onClick={generateLink}
          >
            Generate Link
          </button>
        </div>

        <div>
          <h2>All Links</h2>

          {
            links?.map((linkObj, index) => {
              const { url, slug, clicks } = linkObj;

              return (
                <div className='link-card' key={index}>
                  <p>URL:{url}</p>
                  <p>ShortUrl:{slug}</p>
                  <p>clicks:{clicks}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App
