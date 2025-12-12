import React, { useState } from 'react'
import axios from 'axios'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password })
      const token = res.data.token
      localStorage.setItem('token', token)
      setMsg('Logged in. Token saved to localStorage.')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Login error')
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Login (Email/Password)</h2>
      <form onSubmit={submit}>
        <div><input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder='password' value={password} onChange={e=>setPassword(e.target.value)} type='password' /></div>
        <button type='submit'>Login</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
