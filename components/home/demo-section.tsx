import { Pizza } from "lucide-react";
import { MotionDiv, MotionH3 } from "../common/motion-wrapper";
import { SummaryViewer } from "../summaries/summary-viewer";

const DEMO_SUMMARY = `
# 🚀 Welcome to the Course
- 🌐 Discover the power of building fast and modern web apps with Next.js.
- 📋 Get an overview of what you'll learn, from basic setup to deployment.

# ⚙️ Project Initialization
- 🛠️ Learn how to set up a new Next.js 15 project step-by-step.
- 🗂️ Understand the new \`app\` directory structure and key configuration files.

# 🧭 Routing Made Easy
- 🛣️ Dive into file-based routing with dynamic and nested routes.
- 🧩 Use route groups, parallel routes, and loading/error UI patterns effectively.

# 🧠 Client vs Server Components
- 🔍 Explore the difference between client and server components.
- ⚖️ Learn when and why to use each type for optimal performance.

# 🔄 Data Fetching Techniques
- 📦 Understand SSG, SSR, and ISR for dynamic data needs.
- 📡 Learn how to fetch data using the \`fetch\` API and server actions.

# 🔌 API Routes and Full-stack Power
- 🧰 Create backend APIs using Next.js API routes.
- 🧱 Build secure, full-stack apps with serverless functions and route handlers.

# 🔐 Authentication and Middleware
- 🪪 Integrate authentication using NextAuth or Auth.js.
- 🚧 Protect routes using middleware and manage user sessions securely.

# 🎨 Styling and UI Components
- 💅 Style your app using Tailwind CSS and shadcn/ui.
- 🧱 Build reusable and accessible UI components.

# ⚡ Optimization and Performance
- 🚀 Optimize your Next.js apps with caching, lazy loading, and image optimization.
- 🧠 Use built-in tools like the Next.js analyzer for performance insights.

# 🚀 Deployment and Beyond
- ☁️ Deploy your app to Vercel with CI/CD.
- 📈 Learn to monitor, maintain, and scale your application in production.
`;

export default function DemoSection() {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%-3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.3% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-500" />
          </div>
          <div className="text-center mb-16">
            <MotionH3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-black text-3xl max-w-2xl mx-auto px-4 sm:px-6"
            >
              Watch how sommaire transforms{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                this Next.js course PDF
              </span>
              into an esay-to-read summary!
            </MotionH3>
          </div>
        </div>

        <div className="flex justify-center items-center px-2 sm:px-4 lg:px-6 ">
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryViewer summary={DEMO_SUMMARY} />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
