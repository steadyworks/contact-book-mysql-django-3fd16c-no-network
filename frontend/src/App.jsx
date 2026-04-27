import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3001/api/contacts/'

function ContactForm({ contact, onClose, onSaved }) {
  const [form, setForm] = useState({
    first_name: contact?.first_name || '',
    last_name: contact?.last_name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    address: contact?.address || '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('All fields are required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      const method = contact ? 'PUT' : 'POST'
      const url = contact ? `${API_URL}${contact.id}/` : API_URL
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        const messages = Object.values(data).flat().join(' ')
        setError(messages || 'Failed to save contact.')
        return
      }
      onSaved()
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000,
  }
  const boxStyle = {
    background: 'white', padding: '24px', borderRadius: '8px',
    width: '400px', maxWidth: '90vw',
  }
  const inputStyle = {
    display: 'block', width: '100%', marginBottom: '12px',
    padding: '8px', fontSize: '14px', boxSizing: 'border-box',
    border: '1px solid #ccc', borderRadius: '4px',
  }

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <h2 style={{ marginTop: 0 }}>{contact ? 'Edit Contact' : 'Add Contact'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            data-testid="first-name-input"
            style={inputStyle}
            placeholder="First Name"
            value={form.first_name}
            onChange={e => setForm({ ...form, first_name: e.target.value })}
          />
          <input
            data-testid="last-name-input"
            style={inputStyle}
            placeholder="Last Name"
            value={form.last_name}
            onChange={e => setForm({ ...form, last_name: e.target.value })}
          />
          <input
            data-testid="email-input"
            style={inputStyle}
            placeholder="Email"
            type="text"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            data-testid="phone-input"
            style={inputStyle}
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <input
            data-testid="address-input"
            style={inputStyle}
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          {error && (
            <div data-testid="form-error" style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              data-testid="contact-submit"
              type="submit"
              style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)

  const fetchContacts = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    } catch {
      setContacts([])
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      await fetchContacts()
    } catch {
      // ignore
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingContact(null)
    setShowForm(true)
  }

  const handleSaved = async () => {
    setShowForm(false)
    setEditingContact(null)
    await fetchContacts()
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingContact(null)
  }

  const filteredContacts = contacts.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    )
  })

  const containerStyle = { maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }
  const headerStyle = { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }
  const cardStyle = {
    border: '1px solid #ddd', borderRadius: '8px', padding: '16px',
    marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginTop: 0 }}>Contact Book</h1>
      <div style={headerStyle}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          data-testid="add-contact-btn"
          onClick={handleAdd}
          style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Add Contact
        </button>
      </div>

      {contacts.length === 0 && !search && (
        <div data-testid="empty-state" style={{ textAlign: 'center', color: '#888', padding: '48px 0' }}>
          No contacts yet. Click "Add Contact" to get started.
        </div>
      )}

      <div data-testid="contact-list">
        {filteredContacts.map(contact => (
          <div key={contact.id} data-testid="contact-card" style={cardStyle}>
            <div>
              <div style={{ marginBottom: '4px' }}>
                <strong data-testid="contact-name">{contact.first_name} {contact.last_name}</strong>
              </div>
              <div style={{ fontSize: '14px', color: '#555', marginBottom: '2px' }}>
                <span data-testid="contact-email">{contact.email}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#555', marginBottom: '2px' }}>
                <span data-testid="contact-phone">{contact.phone}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                <span data-testid="contact-address">{contact.address}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                data-testid="edit-btn"
                onClick={() => handleEdit(contact)}
                style={{ padding: '6px 12px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                data-testid="delete-btn"
                onClick={() => handleDelete(contact.id)}
                style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ContactForm
          contact={editingContact}
          onClose={handleClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
