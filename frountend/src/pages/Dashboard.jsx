import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard(){
  const [profile, setProfile] = useState(null)
  const [company, setCompany] = useState({ company_name:'', city:'', state:'', country:'', industry:'', logo_url:'' })
  const [msg, setMsg] = useState('')

  async function fetchProfile(){
    const token = localStorage.getItem('token')
    if (!token) { setMsg('Login first'); return }
    try {
      const res = await axios.get('http://localhost:4000/api/company/profile', { headers: { Authorization: 'Bearer ' + token } })
      setProfile(res.data.data)
      if (res.data.data) setCompany(res.data.data)
    } catch (err) {
      setMsg('Error fetching')
    }
  }

  async function save(e){
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.post('http://localhost:4000/api/company/register', company, { headers: { Authorization: 'Bearer ' + token }})
      setMsg('Saved')
      fetchProfile()
    } catch (err) {
      setMsg('Error saving')
    }
  }

  useEffect(()=>{ fetchProfile() }, [])

  return (
    <div style={{padding:20}}>
      <h2>Dashboard / Company</h2>
      {profile ? <div><b>Company:</b> {profile.company_name}</div> : <div>No company yet</div>}
      <form onSubmit={save} style={{marginTop:10}}>
        <div><input placeholder='company name' value={company.company_name} onChange={e=>setCompany({...company, company_name:e.target.value})} /></div>
        <div><input placeholder='city' value={company.city} onChange={e=>setCompany({...company, city:e.target.value})} /></div>
        <div><input placeholder='state' value={company.state} onChange={e=>setCompany({...company, state:e.target.value})} /></div>
        <div><input placeholder='country' value={company.country} onChange={e=>setCompany({...company, country:e.target.value})} /></div>
        <div><input placeholder='industry' value={company.industry} onChange={e=>setCompany({...company, industry:e.target.value})} /></div>
        <div><input placeholder='logo url (Cloudinary)' value={company.logo_url} onChange={e=>setCompany({...company, logo_url:e.target.value})} /></div>
        <button type='submit'>Save Company</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
