# Dolamo Attorneys Website

A modern, responsive website for a law firm or legal practice, built with HTML, CSS, JavaScript, Bootstrap, and Node.js. The project includes multiple service pages, contact and appointment request forms, and a professional legal branding style.

## Overview

This project is designed for a professional legal consultancy and is tailored around the branding and services of Dolamo Attorneys Inc.

It includes multiple pages for:

- Home
- About Us
- Services
- Individual legal practice pages
- Contact Us
- Request Appointment / Quote
- Error Page

## Features

- Responsive multi-page layout
- Professional legal firm branding
- Bootstrap-based structure
- Custom CSS styling and responsive design
- Image sliders and animated sections
- Contact and appointment call-to-actions
- Service-specific detail pages
- jQuery plugins for UI interactions and animations
- Contact and appointment enquiry email functionality
- Newsletter subscription form

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Bootstrap
- jQuery
- Node.js
- Express.js
- Nodemailer
- FontAwesome and custom icon fonts

## Project Structure

```text
.
├── index.html
├── about-us.html
├── contact.html
├── Request-Quote.html
├── service-style-one.html
├── Civil-Litigation.html
├── Family-law.html
├── Business-Taxation.html
├── Accident-Injuries.html
├── Education-Law.html
├── Trade-&-Finance-law.html
├── css/
├── fonts/
├── images/
├── js/
├── server/
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── README.md
└── Version/
```

## Running the Project Locally

### Prerequisites

Before running the project, ensure you have installed:

- Node.js 18 or newer
- npm (included with Node.js)
- Visual Studio Code (recommended)

### 1. Clone or Download the Repository

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate into the project directory:

```bash
cd dolamo-attorneys-website-main
```

### 2. Install Backend Dependencies

Navigate into the server directory:

```bash
cd server
```

Install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file by copying the provided `.env.example` file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Open `server/.env` and configure the SMTP settings:

```env
PORT=3000

SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@dattorney.co.za
SMTP_PASS=YOUR_MAILBOX_PASSWORD

MAIL_TO=admin@dattorney.co.za
MAIL_FROM="Dolamo Attorneys Website" <admin@dattorney.co.za>

TRUST_PROXY=0
```

Replace `YOUR_MAILBOX_PASSWORD` with the actual mailbox password or app password.

**Important:** Never commit or share the `.env` file. It contains sensitive email credentials.

### 4. Start the Application

While inside the `server` directory, run:

```bash
npm start
```

The Node.js server will start on port 3000.

### 5. Open the Website

Open your browser and navigate to:

```text
http://localhost:3000
```

The Node.js server serves the frontend pages and handles form submissions.

Keep the backend terminal running while using the website.

## How the Forms Work

The website includes three types of forms:

| Page / Form | `data-form-type` | Email Subject |
|---|---|---|
| Contact page form | `contact` | Website Enquiry: subject |
| Find Lawyer (Home and Request-Quote) | `appointment` | Appointment Request: category |
| Footer Subscribe | `subscribe` | New Newsletter Subscription |

### Form Submission Process

1. The user completes and submits a form.
2. `js/forms.js` collects the form information.
3. The form data is sent as JSON to `/api/contact`.
4. `server/server.js` validates the submitted information.
5. Nodemailer sends the email through the configured SMTP account.
6. The server returns a response.
7. A success or error message is displayed under the submitted form.

Enquiries are delivered to:

**admin@dattorney.co.za**

The client's email address is configured as the Reply-To address where applicable.

## Notes

- The frontend consists of static HTML, CSS, and JavaScript files.
- The Node.js server is required for form email functionality.
- The server also serves the website pages locally.
- Plain static hosting cannot independently send emails through the configured SMTP service.
- Never commit `server/.env` to GitHub.
- Keep `server/.env.example` updated without including real credentials.
- Images, fonts, and JavaScript libraries are stored locally in their respective project folders.

## Security

- Keep SMTP credentials private.
- Validate form submissions on the backend.
- Do not expose email passwords in frontend JavaScript.
- Ensure `.env` is included in `.gitignore`.
