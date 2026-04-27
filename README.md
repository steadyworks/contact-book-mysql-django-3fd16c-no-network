# Contact Book

Build a fullstack contact book app from scratch. Users can create, view, update, and delete contacts. Each contact stores personal details and is persisted to a local MySQL database so data survives server restarts.

## Stack

- **Frontend**: React (port 3000) — plain React, no framework
- **Backend**: Django (port 3001)
- **Database**: MySQL at port 3306, schema name `contacts`

## Features

### Contact Management

Every contact has five fields:

| Field | Notes |
|-------|-------|
| First name | required |
| Last name | required |
| Email | required, must be a valid email format |
| Phone | required |
| Address | required |

All five fields are required. Submitting an incomplete or malformed form must produce a visible error — the contact must not be saved.

The contact list is sorted by most recently added or updated, so newly created or edited contacts rise to the top.

### Search and Filter

A search bar lets users narrow the visible contacts in real time. It filters across first name, last name, email, and phone simultaneously. Contacts that do not match any of those fields are hidden while the search term is active. Clearing the search restores the full list.

### Pages

**`/`** — The main view. Shows the full contact list (or an empty state when there are none). Contains the search bar and an "Add Contact" button. Each contact entry shows all five fields and offers Edit and Delete actions.

**`/contacts/new`** — A form for creating a new contact with inputs for all five fields and a submit button. Navigates back to `/` on success.

**`/contacts/:id/edit`** — The same form, pre-filled with the selected contact's current values. Saving changes navigates back to `/`.

> The add and edit routes may alternatively be rendered as a modal or slide-over on the main page — the choice is yours, but the `data-testid` attributes below must be present regardless of implementation approach.

### Backend

The Django server must expose a JSON API consumed by the React frontend. CORS must be configured to allow requests from the frontend origin. All contact data must be stored in MySQL — in-memory storage is not acceptable.

### Validation

Validate on both the frontend and the backend. The frontend must show an inline error message when required fields are empty or the email is malformed. The backend must reject invalid payloads with an appropriate error response.

## UI Requirements

These `data-testid` attributes must be present exactly as written — the test harness depends on them.

### Contact list (`/`)

- `data-testid="empty-state"` — message or element shown when no contacts exist (and no search is active)
- `data-testid="add-contact-btn"` — button that opens or navigates to the new-contact form
- `data-testid="search-input"` — the search/filter text input
- `data-testid="contact-list"` — the container wrapping all contact entries
- `data-testid="contact-card"` — each individual contact entry (there will be multiple)
- `data-testid="contact-name"` — the contact's full name (first + last) inside each card
- `data-testid="contact-email"` — the email address inside each card
- `data-testid="contact-phone"` — the phone number inside each card
- `data-testid="contact-address"` — the address inside each card
- `data-testid="edit-btn"` — the edit action button inside each card
- `data-testid="delete-btn"` — the delete action button inside each card

### Contact form (new and edit)

- `data-testid="first-name-input"` — first name field
- `data-testid="last-name-input"` — last name field
- `data-testid="email-input"` — email field
- `data-testid="phone-input"` — phone field
- `data-testid="address-input"` — address field
- `data-testid="contact-submit"` — the save / submit button
- `data-testid="form-error"` — inline error message shown when validation fails
