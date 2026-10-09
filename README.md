# E-Cycle

**Smart E-Waste Identification & Responsible Disposal Assistant**

[![Environmental Hacks Hackathon](https://img.shields.io/badge/Environmental%20Hacks-Hackathon-green)](https://environmentalhacks.dev)
[![Zero Cost](https://img.shields.io/badge/Cost-%E2%82%B90-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Problem Statement

Electronic waste (e-waste) is the world's fastest-growing waste stream. In 2022, an estimated **62 million metric tonnes** of e-waste were generated globally, with only **22.3%** documented as properly collected and recycled. Most people don't know:
- Which items qualify as e-waste
- How to prepare devices for safe disposal
- Where to take them for responsible recycling
- What data protection steps to take

## Solution

E-Cycle helps users **identify** electronic items, **classify** them as e-waste, and **guide** them through responsible handling and disposal.

### Key Features

| Feature | Description |
|---------|-------------|
| **Photo Scan** | Upload a photo → Local classifier identifies the item (filename-based) |
| **Manual Mode** | Select from 14 categories when photo analysis is uncertain |
| **E-Waste Classification** | Rule-based engine maps detected labels to e-waste categories |
| **Handling Guides** | Category-specific checklists, prep steps, and disposal instructions |
| **Data Prep Checklist** | Step-by-step data removal guidance for personal devices |
| **My E-Waste** | Track saved items with status updates (Saved → Needs Action → Ready → Handled) |
| **Disposal Finder** | Find disposal options (structure ready for verified data integration) |
| **AI Assistant** | Ask questions about e-waste handling using app's guidance data |

---

## Architecture

### Zero-Cost Local Development (Default)
```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend  │────▶│  Express API    │────▶│  In-Memory Store │
│  (React)    │     │  (localhost)    │     │  (mockItems Map) │
└─────────────┘     └─────────────────┘     └──────────────────┘
                           │
                           ▼
                    ┌─────────────────┐
                    │  Local Mock     │
                    │  Classifier     │
                    │  (filename)     │
                    └─────────────────┘
```

### Production Architecture (AWS - Optional)
```
┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌────────────────┐
│   Frontend  │────▶│  API Gateway │────▶│  Lambda  │────▶│  AWS Rekognition│
│  (React)    │     │   (REST)     │     │ Functions│     │  (Image Labels) │
└─────────────┘     └──────────────┘     └──────────┘     └────────────────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐     ┌──────────────┐
                    │     S3       │     │  DynamoDB    │
                    │  (Images)    │     │  (Items)     │
                    └──────────────┘     └──────────────┘
```

---

## Tech Stack

**Frontend:**
- React 18 + Vite
- React Router 6
- Tailwind CSS
- Vanilla JavaScript (ES Modules)

**Backend (Local Development):**
- Node.js 18+ / 20+
- Express.js
- In-memory storage (no database required)

**Backend (Production - AWS):**
- Node.js 20 (Lambda runtime)
- AWS SDK v3
- AWS SAM for deployment

---

## Project Structure

```
ecycle/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── Layout.jsx    # Header, navigation, footer
│   ├── pages/            # Route-level components
│   │   ├── Home.jsx      # Landing dashboard
│   │   ├── Scan.jsx      # Photo upload & analysis
│   │   ├── Result.jsx    # Identification result + guidance
│   │   ├── ManualIdentify.jsx  # Manual category selection
│   │   ├── Guide.jsx     # Category-specific disposal guide
│   │   ├── MyEwaste.jsx  # Saved items list
│   │   ├── DisposalFinder.jsx  # Location search (mock data)
│   │   └── Assistant.jsx # AI chat assistant
│   ├── services/
│   │   ├── api.js        # Backend API client
│   │   └── storage.js    # localStorage fallback
│   ├── data/
│   │   └── ewaste.js     # Categories & guidance data
│   ├── utils/
│   │   └── classification.js  # Rekognition label → e-waste mapping
│   ├── styles/
│   │   └── index.css     # Tailwind + custom styles
│   ├── App.jsx           # Routing
│   └── main.jsx          # Entry point
├── backend/
│   ├── functions/        # Lambda handlers (production)
│   │   ├── analyze-image.js   # S3 + Rekognition (requires AWS)
│   │   ├── items.js           # DynamoDB CRUD (requires AWS)
│   │   ├── disposal-finder.js # Location search
│   │   └── assistant.js       # Guidance-based Q&A
│   ├── functions/        # Local mock handlers (development)
│   │   ├── analyze-image.local.js  # Filename-based mock classifier
│   │   └── items.local.js        # In-memory item storage
│   ├── server.js         # Local Express dev server
│   ├── template.yaml     # SAM template for AWS deployment
│   └── package.json
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 9+

**No AWS account, credentials, or cloud resources required for local development.**

### Quick Start (Both Frontend + Backend)

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Start both servers (frontend on :3000, backend on :3001)
npm run dev:full
```

**Open http://localhost:3000** — the app loads with full backend integration via Vite proxy.

### Manual Start (Separate Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Runs on http://localhost:3001 with in-memory mock storage and local classifier.

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Runs on http://localhost:3000. Proxies `/api/*` to backend via Vite proxy.

### Environment Variables

**Frontend (.env.local)** - optional, defaults work:
```env
VITE_API_BASE=http://localhost:3001/api
```

**Backend** - no environment variables required for local development.

---

## What Works Locally (Zero Cost)

| Feature | Implementation | Notes |
|---------|----------------|-------|
| **Photo Upload & Preview** | ✅ Full | Browser File API |
| **Image Classification** | ✅ Filename-based | Returns realistic labels based on filename keywords |
| **Manual Category Selection** | ✅ Full | 14 e-waste categories |
| **E-Waste Classification** | ✅ Rule-based | Transparent keyword matching |
| **Handling Guides** | ✅ Full | All 14 categories with checklists |
| **Data Prep Checklists** | ✅ Full | Category-specific steps |
| **Save/Load Items** | ✅ In-memory + localStorage | Persists in browser, backend sync works |
| **Update/Delete Items** | ✅ Full | CRUD via local API |
| **Disposal Finder** | ✅ Mock data | Returns SF locations or "no data" message |
| **AI Assistant** | ✅ Rule-based | Uses local guidance data |

### Local Classifier Behavior

The local classifier (`analyze-image.local.js`) returns deterministic labels based on the **filename**:
- `phone.jpg`, `iphone.png` → Cell Phone, Mobile Phone, Electronics
- `laptop.png`, `macbook.jpg` → Laptop, Computer, Electronics
- `tablet.jpg`, `ipad.png` → Tablet, Touchscreen
- `monitor.jpg`, `screen.png` → Monitor, Display
- `charger.jpg`, `adapter.png` → Power Adapter, Charger, Cable
- `headphones.jpg`, `airpods.png` → Headphones, Earphones
- `battery.jpg`, `powerbank.png` → Battery, Power Bank
- Any other filename → Generic Electronics

**This is NOT Amazon Rekognition.** It's a transparent, rule-based mock for zero-cost development.

---

## Testing the User Journey

1. **Open http://localhost:3000** → Home dashboard loads
2. **Click "Scan an Item"** → Navigate to scan page
3. **Upload photo** → Select image (try `phone.jpg`, `laptop.png`, etc.)
4. **Click "Analyze Item"** → Shows uploading → analyzing with local classifier
5. **View Result** → Item identified, confidence score, e-waste badge
6. **Click "View Handling Guide"** → Category-specific checklist
7. **Click "Save to My E-Waste"** → Item added via local API
8. **Navigate to "My E-Waste"** → See saved item with status
9. **Update status** → Saved → Needs Action → Ready → Handled
10. **Try "Identify Manually"** → Select category without photo

---

## Production Deployment (Optional - Requires AWS)

If you want to deploy to AWS (incurs costs):

### Backend (AWS SAM)
```bash
cd backend
sam build
sam deploy --guided
```
Creates: S3 bucket, DynamoDB tables, 4 Lambda functions, API Gateway, IAM roles.

### Frontend (AWS Amplify)
1. Connect GitHub repo to Amplify Console
2. Build: `npm run build`, Output: `dist/`
3. Set `VITE_API_BASE` to your API Gateway URL

---

## Known Limitations (Local Mode)

1. **No Real Image Recognition**: Classifier uses filename, not image content. Use Manual Mode for accurate categorization.
2. **In-Memory Backend Storage**: Items lost on backend restart. Frontend localStorage persists across reloads.
3. **Mock Disposal Data**: Only hardcoded SF locations. No live API integration.
4. **No Authentication**: Single-user demo.
5. **Assistant is Rule-Based**: Not an LLM. Only answers from guidance data.

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (port 3000) |
| `npm run dev:backend` | Start backend only (port 3001) |
| `npm run dev:full` | Start both concurrently |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | No tests configured |

---

## Credits & Licenses

- **Icons**: Unicode emoji (system fonts)
- **Fonts**: Inter via Google Fonts (SIL Open Font License)
- **AWS SDK**: Apache 2.0
- **React, Vite, Tailwind**: MIT
- **Guidance Content**: Based on publicly available e-waste best practices (EPA, Basel Convention, manufacturer guidelines)

---

## AI Coding Tools Used

This project was built with assistance from:
- **Claude Code** (Anthropic) - Architecture, implementation, code review
- **GitHub Copilot** - Boilerplate, Tailwind classes

All code was reviewed and tested by the human developer.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Hackathon Compliance (Environmental Hacks)

✅ **New project** built during hackathon  
✅ **Zero-cost local development** - no cloud credentials needed  
✅ **AWS architecture ready** - SAM template included for optional deployment  
✅ **Source code public & organized**  
✅ **AI tools disclosed** in this README  
✅ **No fake claims** - local classifier clearly labeled as mock  
✅ **No fake data presented as real** - disposal finder shows disclaimer  
✅ **No secrets committed** - `.env.example` only  

---

*Built for the Environmental Hacks Hackathon - Waste & Energy Track*