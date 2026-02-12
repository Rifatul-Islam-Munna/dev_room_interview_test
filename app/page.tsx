import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  TrendingUp,
  Users,
  PieChart,
  Zap,
  Shield,
  BarChart3,
  Check,
} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                FinanceFlow
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                How it works
              </Link>
              <Link
                href="#testimonials"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Testimonials
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {userId ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Trusted by 10,000+ users worldwide
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Take Control of Your
              <span className="text-blue-600"> Financial Life</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Simple, powerful tools to track expenses, manage income, and
              collaborate on shared finances. Everything you need in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {userId ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors">
                      Start Free Trial
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </SignUpButton>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    View Demo
                  </button>
                </>
              )}
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                $2.4M+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Transactions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                10K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                99.9%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Uptime
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage money
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed to simplify your financial life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Wallet,
                title: "Expense Tracking",
                description:
                  "Track every purchase with detailed descriptions, categories, and automatic balance calculations.",
              },
              {
                icon: TrendingUp,
                title: "Income Management",
                description:
                  "Organize income by custom categories. Track salary, freelance work, and side projects.",
              },
              {
                icon: Users,
                title: "Shared Wallets",
                description:
                  "Split expenses with friends and family. Perfect for trips, dinners, and group activities.",
              },
              {
                icon: PieChart,
                title: "Visual Analytics",
                description:
                  "Beautiful charts to visualize spending patterns over time and across categories.",
              },
              {
                icon: BarChart3,
                title: "Custom Reports",
                description:
                  "Generate detailed reports filtered by date ranges, categories, and transaction types.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Bank-level encryption keeps your financial data safe and secure at all times.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get started in minutes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Three simple steps to take control of your finances
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Create Account",
                description:
                  "Sign up with email or social login. No credit card required to start.",
              },
              {
                step: "2",
                title: "Add Transactions",
                description:
                  "Start tracking expenses and income. Set up categories that work for you.",
              },
              {
                step: "3",
                title: "Get Insights",
                description:
                  "View analytics and make informed decisions about your spending habits.",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by thousands
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See what our users have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Freelancer",
                content:
                  "Finally a finance tracker that's actually simple to use. The shared wallets feature is perfect for group trips.",
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content:
                  "The analytics helped me discover I was spending $400/month on forgotten subscriptions. Already saved thousands!",
              },
              {
                name: "Emma Williams",
                role: "Business Owner",
                content:
                  "Perfect for managing both personal and business finances. The custom categories are a game-changer.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to take control of your finances?
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Join thousands of users managing their money smarter. Start your
              free trial today.
            </p>
            {!userId && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </SignUpButton>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 text-base font-medium text-white hover:bg-gray-700 transition-colors">
                  Schedule Demo
                </button>
              </div>
            )}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  FinanceFlow
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                Simple, powerful finance management for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>© 2026 FinanceFlow. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
