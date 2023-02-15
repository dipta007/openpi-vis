import logo from './logo.svg';
import './App.css';
import json from './gold-v1.1/train.jsonl'
import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([])
  const [url_to_img, setUrl_to_img] = useState({})
  const [urls, setUrls] = useState([])
  const [random_data, setRandom_data] = useState([])

  async function get_data() {
    let data = []
    const response = await fetch(json)
    const text = await response.text()
    const texts = text.split('\n')
    for (let i = 0; i < texts.length; i++) {
      try {
        let obj = JSON.parse(texts[i])
        data.push(obj)
      }
      catch (e) {
        console.log(i, texts[i], e)
      }
    }
    setData(data)
  }

  const get_url_to_img = () => {
    let url_to_img = {}
    let urls = []
    for (let i = 0; i < data.length; i++) {
      let url = data[i].question_metadata.url
      if (urls.indexOf(url) === -1) {
        url_to_img[url] = []
        urls.push(url)
      }
      let obj = {}
      obj['url'] = url
      obj['step_id'] = parseInt(data[i].question_metadata.step_id)
      obj['query'] = data[i].question_metadata.query
      obj['image_url'] = data[i].question_metadata.image_url
      obj['topic'] = data[i].question_metadata.topic
      obj['answers'] = data[i].answers

      url_to_img[url].push(obj)
    }
    setUrl_to_img(url_to_img)
    setUrls(urls)
  }

  const get_random_data = () => {
    let random_url = urls[Math.floor(Math.random() * urls.length)]
    let random_data = url_to_img[random_url]
    setRandom_data(random_data)
  }

  useEffect(()=>{
    get_data()
  },[])

  useEffect(()=>{
    get_url_to_img()
  },[data])

  useEffect(()=>{
    get_random_data()
  },[url_to_img])

  console.log(random_data)
  if (random_data && random_data.length) {
    console.log()
  }

  const get_formatted_answer = (answer) => {
    let formatted_answer = []
    answer = answer.split(" ")
    console.log(answer, answer.indexOf('of'))
    formatted_answer.push(<span style={{ color: 'orange', fontWeight: 'bold' }}>{answer.slice(0, answer.indexOf('of')).join(" ")}</span>)
    formatted_answer.push(" of ")
    formatted_answer.push(<span style={{ color: 'blue', fontWeight: 'bold' }}>{answer.slice(answer.indexOf('of') + 1, answer.indexOf('was')).join(" ")}</span>)
    formatted_answer.push(" was ")
    formatted_answer.push(<span style={{ color: 'red', fontWeight: 'bold' }}>{answer.slice(answer.indexOf('was') + 1, answer.indexOf('before')).join(" ")}</span>)
    formatted_answer.push(" before and ")
    formatted_answer.push(<span style={{ color: 'green', fontWeight: 'bold' }}>{answer.slice(answer.indexOf('and') + 1, answer.indexOf('afterwards')).join(" ")}</span>)
    formatted_answer.push(" afterwards")
    return formatted_answer
  }
  return (
    <div className="App">
      {!random_data?.length && <div>loading</div>}
      {random_data && random_data.length ?
        <>
          <h1><a href={`https://${random_data[0].url}`} target="_blank">URL</a>: {random_data[0].url.split('/')[1]}</h1>
          <h2>Topic: {random_data[0].topic}</h2>
          <table>
            {/* Step */}
            <tr>
              {random_data.map((item) => (
                <td>{item.step_id}</td>
              ))}
            </tr>
            {/* Image */}
            <tr>
              {random_data.map((item) => (
                <td><img id="context_img" src={item.image_url} width="200" alt={item.query} /></td>
              ))}
            </tr>
            {/* Query */}
            <tr>
              {random_data.map((item) => (
                <td>{item.query}</td>
              ))}
            </tr>
            {/* Answers */}
            <tr>
              {random_data.map((item) => (
                <td>
                  <ul>
                    {item.answers.map((answer, index) => (
                      <li><p>{get_formatted_answer(answer)}</p></li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </table>
          <div style={{ margin: '40px' }}></div>
          <button onClick={get_random_data}>Next</button>
        </>
        : null
      }
    </div>
  );
}

export default App;
