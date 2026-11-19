# 🔗 Simple URL Shortener

A “simple” URL shortener built by **Vibecoding**, using:

- 🧠 Gemini 2.5 Pro for AI pair programming
- ⚙️ Next.js (TypeScript)
- 🎨 Tailwind CSS for styling
- 🗃️ MongoDB for storing URLs
- ☁️ Firebase Studio for deployment and project management

This project may look small, but took an emotional toll far beyond its lines of code. Built through late-night debugging, existential dread, and the quiet hum of the terminal window.

---

## 🧠 Why?

> Because sometimes you just want to shorten a URL... and accidentally spiral into a coding-induced identity crisis.

---

## 🚀 Tech Stack

| Tech        | Purpose                  |
|-------------|--------------------------|
| Next.js     | React framework          |
| TypeScript  | Strict typing & clarity  |
| Tailwind CSS| Fast, utility-first UI   |
| MongoDB     | URL storage (short ➜ long) |
| Firebase Studio | Hosting / mgmt       |
| Gemini 2.5 Pro | Silent AI therapist   |

---

## 📦 Setup Instructions

1. **Clone the repo:**

```bash
git clone https://github.com/IndraNurfa/firebase-short-url.git
cd firebase-short-url
```
2. **Install dependencies:**

```bash
npm install
```

3. **Create your .env.local file:**
```env
MONGODB_URI=your_mongodb_connection_string
TEMP_LINK_SECRET=a_long_random_string   # e.g. openssl rand -base64 32
```

4. **Run the app locally:**
```bash
npm run dev
```

App will be available at http://localhost:3000

⚙️ **Features**
- 🔗 Shorten long URLs with a unique ID
- 📜 Automatically redirects from short → long
- 🖥️ Responsive design (Tailwind)
- 🤖 Built under the "guidance" of Gemini 2.5 Pro (and some stupid iteration obviously)
