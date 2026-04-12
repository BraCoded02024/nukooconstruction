"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getProperties, createProperty, deleteProperty, uploadDocument,
  getLeads, updateLead, deleteLead, replyToLead,
  getTasks, createTask, updateTask, deleteTask,
  getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment,
  getDocuments, deleteDocument
} from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { 
  LayoutDashboard, Home, Users, CheckSquare, LogOut, Plus, Trash2, CheckCircle, Clock, Mail, Send, X, Calendar, FileText, Download, ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'

type Tab = 'properties' | 'leads' | 'tasks' | 'appointments' | 'documents'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('properties')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Properties State
  const [properties, setProperties] = useState([])
  const [propData, setPropData] = useState({ title: '', description: '', location: '', price: '', status: 'available' })
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Leads State
  const [leads, setLeads] = useState([])
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  // Tasks State
  const [tasks, setTasks] = useState([])
  const [taskData, setTaskData] = useState({ title: '', description: '', due_date: '' })

  // Appointments State
  const [appointments, setAppointments] = useState([])
  const [appointmentData, setAppointmentData] = useState({ 
    client_name: '', 
    client_email: '', 
    client_phone: '', 
    visit_date: '', 
    visit_time: '', 
    purpose: '' 
  })

  // Documents State
  const [documents, setDocuments] = useState([])
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docTitle, setDocFileTitle] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      if (activeTab === 'properties') {
        const res = await getProperties()
        setProperties(res.data)
      } else if (activeTab === 'leads') {
        const res = await getLeads()
        setLeads(res.data)
      } else if (activeTab === 'tasks') {
        const res = await getTasks()
        setTasks(res.data)
      } else if (activeTab === 'appointments') {
        const res = await getAppointments()
        setAppointments(res.data)
      } else if (activeTab === 'documents') {
        const res = await getDocuments()
        setDocuments(res.data)
        // Also fetch properties for the dropdown
        const propRes = await getProperties()
        setProperties(propRes.data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Property Handlers
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        const formData = new FormData()
        formData.append('document', imageFile)
        const res = await uploadDocument(formData)
        imageUrl = res.data.file_url
      }
      await createProperty({ ...propData, images: imageUrl ? [imageUrl] : [] })
      setPropData({ title: '', description: '', location: '', price: '', status: 'available' })
      setImageFile(null)
      fetchData()
    } catch (err) { alert('Error adding property') }
    finally { setLoading(false) }
  }

  const handleDeleteProperty = async (id: number) => {
    if (confirm('Delete property?')) {
      await deleteProperty(id)
      fetchData()
    }
  }

  // Lead Handlers
  const handleUpdateLead = async (id: number, status: string) => {
    await updateLead(id, { status })
    fetchData()
  }

  const handleDeleteLead = async (id: number) => {
    if (confirm('Delete lead?')) {
      await deleteLead(id)
      fetchData()
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyingTo || !replyMessage) return
    
    setSendingReply(true)
    try {
      await replyToLead(replyingTo.id, replyMessage)
      alert('Reply sent successfully!')
      setReplyingTo(null)
      setReplyMessage('')
      fetchData() // Refresh list to see updated status
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error sending reply')
    } finally {
      setSendingReply(false)
    }
  }

  // Task Handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTask(taskData)
    setTaskData({ title: '', description: '', due_date: '' })
    fetchData()
  }

  const handleToggleTask = async (task: any) => {
    await updateTask(task.id, { ...task, completed: !task.completed })
    fetchData()
  }

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id)
    fetchData()
  }

  // Appointment Handlers
  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createAppointment(appointmentData)
      setAppointmentData({ 
        client_name: '', 
        client_email: '', 
        client_phone: '', 
        visit_date: '', 
        visit_time: '', 
        purpose: '' 
      })
      fetchData()
    } catch (err) { alert('Error adding appointment') }
    finally { setLoading(false) }
  }

  const handleUpdateAppointmentStatus = async (id: number, status: string) => {
    await updateAppointmentStatus(id, status)
    fetchData()
  }

  const handleDeleteAppointment = async (id: number) => {
    if (confirm('Delete appointment?')) {
      await deleteAppointment(id)
      fetchData()
    }
  }

  // Document Handlers
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docFile) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('document', docFile)
      formData.append('title', docTitle || docFile.name)
      if (selectedPropertyId) {
        formData.append('property_id', selectedPropertyId)
      }
      await uploadDocument(formData)
      setDocFile(null)
      setDocFileTitle('')
      setSelectedPropertyId('')
      fetchData()
    } catch (err) { alert('Error uploading document') }
    finally { setLoading(false) }
  }

  const handleDeleteDoc = async (id: number) => {
    if (confirm('Delete document?')) {
      try {
        await deleteDocument(id)
        fetchData()
      } catch (err: any) {
        console.error('Error deleting document:', err)
        alert(err.response?.data?.error || 'Error deleting document')
      }
    }
  }

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 pt-20 relative flex-col md:flex-row">
        {/* Mobile Tab Selector */}
        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border sticky top-20 z-30 no-scrollbar">
          <div className="flex p-2 gap-2 min-w-max">
            <button 
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs transition-colors ${activeTab === 'properties' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <Home className="w-4 h-4" /> Properties
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs transition-colors ${activeTab === 'leads' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <Users className="w-4 h-4" /> Leads
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs transition-colors ${activeTab === 'appointments' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <Calendar className="w-4 h-4" /> Visits
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs transition-colors ${activeTab === 'tasks' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <CheckSquare className="w-4 h-4" /> Tasks
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs transition-colors ${activeTab === 'documents' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <FileText className="w-4 h-4" /> Docs
            </button>
            <a 
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs text-primary hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Site
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Sidebar (Desktop) */}
        <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'properties' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Home className="w-5 h-5" /> Properties
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'leads' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Users className="w-5 h-5" /> Leads
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'appointments' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Calendar className="w-5 h-5" /> Office Visits
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'tasks' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <CheckSquare className="w-5 h-5" /> Tasks & Notes
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'documents' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <FileText className="w-5 h-5" /> Documents
          </button>
          <div className="flex-1" />
          <a 
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-primary hover:bg-primary/5 transition-colors mb-2"
          >
            <ExternalLink className="w-5 h-5" /> View Public Site
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          {/* ... (keep headers) */}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Add New Property</h2>
                <form onSubmit={handleAddProperty} className="space-y-4 bg-card p-6 border border-border">
                  <input 
                    placeholder="Property Title" 
                    required
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={propData.title}
                    onChange={e => setPropData({...propData, title: e.target.value})}
                  />
                  <input 
                    placeholder="Location" 
                    required
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={propData.location}
                    onChange={e => setPropData({...propData, location: e.target.value})}
                  />
                  <input 
                    placeholder="Price (e.g. $500,000)" 
                    required
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={propData.price}
                    onChange={e => setPropData({...propData, price: e.target.value})}
                  />
                  <textarea 
                    placeholder="Description" 
                    className="w-full bg-background border border-border p-3 outline-none h-32" 
                    value={propData.description}
                    onChange={e => setPropData({...propData, description: e.target.value})}
                  />
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Property Image</label>
                    <input 
                      type="file" 
                      onChange={e => setImageFile(e.target.files?.[0] || null)} 
                      className="w-full text-sm" 
                    />
                  </div>
                  <button disabled={loading} className="w-full py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs">
                    {loading ? 'Processing...' : 'Publish Property'}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-xl font-serif mb-6">Current Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((p: any) => (
                    <div key={p.id} className="bg-card border border-border overflow-hidden flex flex-col">
                      {p.images?.[0] && (
                        <div className="h-40 bg-muted overflow-hidden">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{p.title}</h3>
                          <button onClick={() => handleDeleteProperty(p.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">{p.location}</p>
                        <p className="text-primary font-bold">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif">Inquiries & Leads</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-card border border-border">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Contact</th>
                      <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Interest</th>
                      <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Status</th>
                      <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Notes</th>
                      <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l: any) => (
                      <tr key={l.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.email}</p>
                          <p className="text-xs text-muted-foreground">{l.phone}</p>
                        </td>
                        <td className="p-4 text-sm">{l.interest}</td>
                        <td className="p-4">
                          <select 
                            value={l.status} 
                            onChange={(e) => handleUpdateLead(l.id, e.target.value)}
                            className="bg-background border border-border p-1 text-xs rounded"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <textarea 
                            defaultValue={l.notes} 
                            onBlur={(e) => updateLead(l.id, { notes: e.target.value })}
                            className="w-full bg-background border border-border p-2 text-xs h-16 outline-none"
                            placeholder="Add notes..."
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setReplyingTo(l)}
                              className="p-2 hover:bg-primary/10 rounded transition-colors text-primary"
                              title="Reply via Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteLead(l.id)} className="p-2 hover:bg-red-50 rounded transition-colors text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reply Modal */}
              {replyingTo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-border p-8 max-w-2xl w-full shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-serif">Reply to {replyingTo.name}</h3>
                      <button onClick={() => setReplyingTo(null)}><X className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleSendReply} className="space-y-4">
                      <div className="p-4 bg-muted text-xs text-muted-foreground italic mb-4">
                        Sending to: {replyingTo.email}
                      </div>
                      <textarea 
                        required
                        placeholder="Write your message here..." 
                        className="w-full bg-background border border-border p-4 outline-none h-64 font-sans" 
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                      />
                      <div className="flex justify-end gap-4">
                        <button 
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="px-6 py-3 border border-border uppercase tracking-widest text-xs"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={sendingReply}
                          className="px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs flex items-center gap-2"
                        >
                          {sendingReply ? 'Sending...' : <><Send className="w-4 h-4" /> Send Reply</>}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Add Task/Note</h2>
                <form onSubmit={handleAddTask} className="space-y-4 bg-card p-6 border border-border">
                  <input 
                    placeholder="Task Title" 
                    required
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={taskData.title}
                    onChange={e => setTaskData({...taskData, title: e.target.value})}
                  />
                  <input 
                    type="date"
                    className="w-full bg-background border border-border p-3 outline-none text-xs" 
                    value={taskData.due_date}
                    onChange={e => setTaskData({...taskData, due_date: e.target.value})}
                  />
                  <textarea 
                    placeholder="Details..." 
                    className="w-full bg-background border border-border p-3 outline-none h-32" 
                    value={taskData.description}
                    onChange={e => setTaskData({...taskData, description: e.target.value})}
                  />
                  <button className="w-full py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs">
                    Create Task
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-xl font-serif mb-6">Active Tasks</h2>
                <div className="space-y-4">
                  {tasks.map((t: any) => (
                    <div key={t.id} className={`p-4 border border-border flex items-center justify-between transition-colors ${t.completed ? 'bg-muted/50 opacity-60' : 'bg-card'}`}>
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleToggleTask(t)} className={t.completed ? 'text-green-500' : 'text-muted-foreground'}>
                          <CheckCircle className="w-6 h-6" />
                        </button>
                        <div>
                          <h3 className={`font-bold ${t.completed ? 'line-through' : ''}`}>{t.title}</h3>
                          <p className="text-xs text-muted-foreground">{t.description}</p>
                          {t.due_date && <p className="text-[10px] uppercase mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {new Date(t.due_date).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteTask(t.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Record Office Visit</h2>
                <form onSubmit={handleAddAppointment} className="space-y-4 bg-card p-6 border border-border">
                  <input 
                    placeholder="Client Name" 
                    required
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={appointmentData.client_name}
                    onChange={e => setAppointmentData({...appointmentData, client_name: e.target.value})}
                  />
                  <input 
                    type="email"
                    placeholder="Client Email" 
                    required
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={appointmentData.client_email}
                    onChange={e => setAppointmentData({...appointmentData, client_email: e.target.value})}
                  />
                  <input 
                    placeholder="Client Phone" 
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={appointmentData.client_phone}
                    onChange={e => setAppointmentData({...appointmentData, client_phone: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="date"
                      required
                      className="w-full bg-background border border-border p-3 outline-none text-xs" 
                      value={appointmentData.visit_date}
                      onChange={e => setAppointmentData({...appointmentData, visit_date: e.target.value})}
                    />
                    <input 
                      type="time"
                      required
                      className="w-full bg-background border border-border p-3 outline-none text-xs" 
                      value={appointmentData.visit_time}
                      onChange={e => setAppointmentData({...appointmentData, visit_time: e.target.value})}
                    />
                  </div>
                  <textarea 
                    placeholder="Purpose of visit / Notes" 
                    className="w-full bg-background border border-border p-3 outline-none h-24" 
                    value={appointmentData.purpose}
                    onChange={e => setAppointmentData({...appointmentData, purpose: e.target.value})}
                  />
                  <button disabled={loading} className="w-full py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs">
                    {loading ? 'Recording...' : 'Record Visit'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-xl font-serif mb-6">Scheduled & Recent Visits</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-card border border-border">
                    <thead>
                      <tr className="bg-muted text-left">
                        <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Client</th>
                        <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Date & Time</th>
                        <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Purpose</th>
                        <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Status</th>
                        <th className="p-4 border-b border-border text-xs uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a: any) => (
                        <tr key={a.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold">{a.client_name}</p>
                            <p className="text-xs text-muted-foreground">{a.client_email}</p>
                            <p className="text-xs text-muted-foreground">{a.client_phone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-sans">{new Date(a.visit_date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{a.visit_time}</p>
                          </td>
                          <td className="p-4 text-sm">{a.purpose || 'N/A'}</td>
                          <td className="p-4">
                            <select 
                              value={a.status} 
                              onChange={(e) => handleUpdateAppointmentStatus(a.id, e.target.value)}
                              className="bg-background border border-border p-1 text-xs rounded"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleDeleteAppointment(a.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Upload Document</h2>
                <form onSubmit={handleUploadDoc} className="space-y-4 bg-card p-6 border border-border">
                  <input 
                    placeholder="Document Title (e.g. Contract)" 
                    className="w-full bg-background border border-border p-3 outline-none" 
                    value={docTitle}
                    onChange={e => setDocFileTitle(e.target.value)}
                  />
                  <select 
                    className="w-full bg-background border border-border p-3 outline-none text-sm"
                    value={selectedPropertyId}
                    onChange={e => setSelectedPropertyId(e.target.value)}
                  >
                    <option value="">Link to Property (Optional)</option>
                    {properties.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <input 
                    type="file" 
                    required
                    onChange={e => setDocFile(e.target.files?.[0] || null)} 
                    className="w-full text-sm" 
                  />
                  <button disabled={loading} className="w-full py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs">
                    {loading ? 'Uploading...' : 'Upload to Cloud'}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-xl font-serif mb-6">Cloud Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((d: any) => (
                    <div key={d.id} className="bg-card p-4 border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm truncate max-w-[150px]">{d.title}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase">{new Date(d.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={d.file_url} target="_blank" rel="noreferrer" className="p-2 hover:bg-muted rounded transition-colors text-primary">
                          <Download className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDeleteDoc(d.id)} className="p-2 hover:bg-red-50 rounded transition-colors text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
