import React, { useState } from 'react'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'

// Firebase config: put real values in .env.local and replace process.env... usage accordingly
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || ''
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Register(){
  const [form, setForm] = useState({ email:'', password:'', full_name:'', mobile_no:'', gender:'o' })
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    try {
      // 1) Create user in Firebase
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await sendEmailVerification(userCred.user)
      // Note: For SMS OTP, set up RecaptchaVerifier and use signInWithPhoneNumber from Firebase
      // 2) Create user in backend
      await axios.post('http://localhost:4000/api/auth/register', form)
      setMsg('Registered. Check email for verification (and implement OTP flow for mobile).')
    } catch (err) {
      console.error(err)
      setMsg(err.message || 'Error')
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Register (Email + Firebase verification)</h2>
      <form onSubmit={submit}>
        <div><input placeholder='full name' value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} /></div>
        <div><input placeholder='email' value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></div>
        <div><input placeholder='password' type='password' value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /></div>
        <div><input placeholder='+9198...' value={form.mobile_no} onChange={e=>setForm({...form, mobile_no:e.target.value})} /></div>
        <button type='submit'>Register</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
