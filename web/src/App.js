import React, { useState } from 'react';
import axios from 'axios'

function App() {
  const [inputs, setInput] = useState('')
  const [deviceId, setDeviceId] = useState(null)
  const [deviceType, setDeviceType] = useState(null)
  const [deviceAttributes, setDeviceAttributes] = useState([{ name: '', value: ''}])

  let server = 'http://localhost:5000'
  let start = () => {
    axios.get(`${server}/api/rs232/start`)
  }
  let write = () => {
    console.log(inputs)
    axios.post(
      `${server}/api/rs232/write`,
      { text: inputs },
      { headers: {
        'Content-Type': 'application/json'
    }})
  }
  let disconnect = () => {
    axios.get(`${server}/api/rs232/disconnect`)
  }
  let addDevice = () => {
    axios.post(
      `${server}/api/cb/addDevice`,
      {
        id: deviceId,
        type: deviceType,
        attributes: deviceAttributes
      },
      { headers: {
        'Content-Type': 'application/json'
    }}).then(() => {
      setDeviceId('')
      setDeviceType('')
      setDeviceAttributes([{ name: '', value: ''}])
    })
  }
  let items = []
  for (let i=0; i<deviceAttributes.length; i+=1 ) {
    items.push(<tr>
        <td>
          <input value={deviceAttributes[i].name} onChange={(e) => {
            let change = [...deviceAttributes]
            change[i].name = e.target.value
            setDeviceAttributes(change)
          }}></input>
        </td>
        <td>
          <input value={deviceAttributes[i].value} onChange={(e) => {
            let change = [...deviceAttributes]
            change[i].value = e.target.value
            setDeviceAttributes(change)
          }}></input>
        </td>
      </tr>)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%'}}>
      <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
        <h1>RS232</h1>
        <button onClick ={() => disconnect()}>Disconnect</button>
        <button onClick={() => start()}>Connect</button>
        <input value={inputs} onChange={(e) => {
          console.log(e.target.value)
          setInput(e.target.value)
        }}></input>
        <button onClick={() => write()}>Send</button>
        <h1>Context Broker</h1>
        <p>Device Id</p>
        <input value={deviceId} onChange={(e) => {
          console.log(e.target.value)
          setDeviceId(e.target.value)
        }}></input>
        <p>Device Type</p>
        <input value={deviceType} onChange={(e) => {
          console.log(e.target.value)
          setDeviceType(e.target.value)
        }}></input>
        <p>Device Attributes</p>
        <table border='1'>
          <tr><th>Name</th><th>Value</th></tr>
          {items}
          <tr>
            <button onClick={() => {
              let change = [...deviceAttributes]
              change.push({name: '', value: ''})
              setDeviceAttributes(change)
            }}>Add row</button>
            <button onClick={() => {
              let change = [...deviceAttributes]
              change.pop()
              setDeviceAttributes(change)
            }
            }>Delete row</button>
          </tr>
        </table>
        <button onClick={() => addDevice()}>Add Device</button>
      </div>
    </div>
  );
}

export default App;
