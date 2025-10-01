# SIP Suite – Investment Calculators (React + Vite + Tailwind)

An interactive collection of personal finance tools focused on Systematic Investment Plans (SIP) and related investment scenarios. Built with React 19, Vite 6, TypeScript, Tailwind CSS, and Recharts for visualizations. The app also includes a Cloudflare Worker (Hono) scaffold for future APIs and edge deployment.

---

## Key Features
- **SIP Calculator**: Estimate maturity value, total invested, and wealth gained with optional inflation adjustment.
- **Lumpsum Calculator**: Compute compound growth for a one-time investment.
- **Goal Planner**: Plan contributions needed to reach a target corpus.
- **Retirement Planner**: Model long-term retirement savings and drawdown assumptions.
- **FD vs SIP**: Compare fixed deposit growth vs SIP returns.
- **Compounding Power**: Visualize how compounding accelerates growth.
- **Fund Explorer**: Placeholder for exploring funds (extendable to plug in real data/APIs).

All calculators present clean inputs, instant calculations, and charts using Recharts.

---

## Overview

### 📈 SIP Calculator
Effortlessly calculate the future value of your monthly investments. This tool visualizes your wealth growth over time, showing the power of compound interest and helping you plan your Systematic Investment Plan (SIP) with precision.

<img width="749" height="731" alt="image" src="https://github.com/user-attachments/assets/9e8a9754-4c10-4dd8-8221-2f606f13a3a5" />

### 💰 Lumpsum Investment Calculator
See how a one-time investment can grow. This calculator projects the total earnings and final value of your lumpsum amount, complete with a year-by-year comparison chart to track your investment's performance.

<img width="740" height="720" alt="image" src="https://github.com/user-attachments/assets/4237c968-8eab-4d21-a46c-b8bf95179968" />

### 🎯 Goal-Based Investment Planner
Turn your financial dreams into reality. Define your target amount and time period, and this planner calculates the exact monthly SIP required to reach your goal. A progress bar and timeline keep you motivated and on track.

<img width="745" height="778" alt="image" src="https://github.com/user-attachments/assets/6f31f827-c067-4cc6-a15b-f2514a8869d8" />

### 🔍 Mutual Fund Explorer
Discover and analyze the best mutual funds for your portfolio. This powerful tool allows you to filter funds by type and risk level, compare top performers, and view detailed metrics to make informed investment decisions.

<img width="552" height="748" alt="image" src="https://github.com/user-attachments/assets/2bd3fc58-7be5-47aa-bd33-a9304e6a2f11" />

### 🌴 Retirement Corpus Estimator
Plan for a secure future with this comprehensive retirement calculator. It estimates the total corpus you'll need by factoring in current expenses, inflation, and life expectancy, then calculates the required monthly SIP to achieve your retirement goals.

<img width="749" height="824" alt="image" src="https://github.com/user-attachments/assets/3bbea829-b2f2-4774-81ed-bea9759f07d8" />

---

## Project Structure
```text
/
├── index.html
├── package.json
├── src/
│   ├── react-app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── main.tsx
│   │   └── index.css
│   ├── shared/
│   │   └── types.ts
│   └── worker/
│       └── index.ts
├── tailwind.config.js
├── vite.config.ts
├── wrangler.jsonc
└── tsconfig.*.json

---

### Notable Files
- `src/react-app/App.tsx`: Routes and top-level layout.
- `src/react-app/pages/*`: Individual calculator pages and views.
- `src/react-app/components/*`: Reusable UI components (cards, inputs, results).
- `src/worker/index.ts`: Cloudflare Worker entry (Hono) – extend for APIs.
- `wrangler.jsonc`: Cloudflare Worker config (D1 binding scaffolded as `DB`).

---

## Available Routes

The app uses React Router. Key paths (
`src/react-app/App.tsx`
):
- `/` – SIP Calculator
- `/lumpsum` – Lumpsum Investment Calculator
- `/goal-planner` – Goal Planner
- `/mutual-funds` – Fund Explorer
- `/retirement` – Retirement Planner
- `/fd-vs-sip` – FD vs SIP
- `/compounding` – Compounding Power

---

## Formulas (At a Glance)

- **SIP maturity value**: \( A = P \times \frac{((1+r)^n - 1)(1+r)}{r} \)
  - `P`: monthly contribution, `r`: monthly return (annual/12), `n`: months
  - Optional inflation adjustment divides by \((1+\pi)^{years}\) (default \(\pi = 6\%\)).

- **Lumpsum (compound interest)**: \( A = P(1+r)^t \)
  - `P`: initial amount, `r`: annual return, `t`: years

These are implemented with rounded display values and Recharts-based visualizations.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router
- **Icons**: lucide-react
- **Edge/Backend scaffold**: Cloudflare Workers + Hono
- **Linting**: ESLint (eslint@9, typescript-eslint)

---


## Deployment

### Static Frontend
The frontend builds to a static bundle. You can deploy the `dist` folder to any static host (e.g., Cloudflare Pages, Netlify, Vercel, S3/CloudFront).

---


### Cloudflare Workers (Edge)
This repo includes a Worker entry (`src/worker/index.ts`) and a `wrangler.jsonc`. To deploy the Worker (for APIs or SSR/edge logic):

1. Install Wrangler: `npm i -D wrangler`
2. Login: `npx wrangler login`
3. (Optional) Generate types for bindings: `npm run cf-typegen`
4. Dry-run check: `npm run check`
5. Deploy: `npx wrangler deploy`

Notes:
- `wrangler.jsonc` has `assets.not_found_handling` set to `single-page-application` to support client routing in SPAs.
- A D1 binding named `DB` is scaffolded. If unused, you may remove the binding from `wrangler.jsonc`.

---

## Configuration

- Tailwind is pre-configured in `tailwind.config.js` and `postcss.config.js`.
- Vite alias `@` points to `src` (see `vite.config.ts`). Use paths like `@/react-app/pages/SipCalculator`.
- TypeScript configs are split (`tsconfig*.json`) for app/node/worker.

---



## Troubleshooting

- If dev server fails on Windows, ensure PowerShell has permission and that Node 20+ is installed.
- If charts don’t render, confirm values are numeric and not `NaN`.
- For Worker deploy issues, check `wrangler --version`, login status, and that your account/project is selected.

---

## License

This project is provided as-is. Add your preferred license if you plan to distribute.

