# WhatsHire v2: Backend Service

Backend service for **WhatsHire** --- an AI-powered job and recruiter
platform featuring WhatsApp Cloud API integration, semantic matching,
and a professional recruiter web portal.

---

## 🚀 Features

- **Express + TypeScript** backend with modular architecture\
- **Sequelize ORM** for robust database management\
- **WhatsApp Cloud API integration** for job seeker interactions\
- **AI Engine**: Pinecone vector search, embeddings, and generative AI
  insights\
- **Recruiter Portal**: Web-based ATS with automated interview
  scheduling\
- **Payments**: PayFast integration for Standard Posts and Premium
  Subscriptions

---

## 📦 Prerequisites

- Node.js (v16+)\
- Cloudflare (`cloudflared` installed locally)\
- Database: PostgreSQL or MySQL (supported by Sequelize)

---

## ⚙️ Local Setup & Configuration

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Configure Secrets & Cloud Keys

- Update `config/config.json` with your database credentials and
  ports.
- Place your `.env` file in the root directory.
- Add your GCP service account JSON and other sensitive keys inside
  the `cloud_keys/` folder.

---

### 3️⃣ WhatsApp Webhook & Cloudflare Tunnel Setup

To receive messages from the WhatsApp Cloud API locally, configure a
Cloudflare tunnel.

#### Step 1: Install Cloudflare

Ensure `cloudflared` is installed on your system.

#### Step 2: Configuration Folder

Navigate to your user profile directory:

    C:\Users\<YourUser>\

Locate or create the `.cloudflared` folder.

#### Step 3: Deploy Tunnel Credentials

Paste the following files into the `.cloudflared` folder:

- `76814576-b357-4851-a4a0-ff153c0be8bc.json` (Tunnel UUID file)\
- `cert.pem`\
- `config.yml`

#### Step 4: Update Credentials Path

Open `config.yml` and update the `credentials-file` path:

```yaml
credentials-file: C:\Users\YourName\.cloudflared\76814576-b357-4851-a4a0-ff153c0be8bc.json
```

#### Step 5: Run the Tunnel

```bash
cloudflared tunnel run tunnel
```

---

## 🗄 Database Initialization

Ensure your database is running, then execute:

```bash
# Uses src/models/createTables.ts and src/sequelize/setup.ts
npm run init-db
```

---

## 🏃 Running the Application

### Development

```bash
npm run dev
```

Runs the server with `ts-node-dev`.

### Production

```bash
npm run build   # Compile TypeScript to JavaScript
npm start       # Start production server
```

---

## 📁 Project Structure

    src/
    │
    ├── index.ts              # Application entry point
    ├── routes/               # Auth, Payments, Recruiter Portal, WhatsApp Webhooks
    ├── controller/           # Request handling logic
    ├── services/             # AI (Pinecone), Email, Payment business logic
    ├── repository/           # Database abstraction layer
    └── sequelize/            # ORM configuration and models
