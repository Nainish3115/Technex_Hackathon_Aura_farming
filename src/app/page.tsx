import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Elderly Focused with Background Image */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-700 to-yellow-800 text-white">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/elderly-background.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 font-serif">
              Aashray AI
            </h1>
            <p className="text-xl md:text-3xl mb-8 text-amber-100 max-w-4xl mx-auto leading-relaxed">
              Your compassionate AI companion for daily support, conversation, and care.
              Bringing warmth and connection to those who need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 text-xl px-8 py-4">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/companion">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 text-xl px-8 py-4">
                  Try Aashray AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section - Person Talking with Aashray AI */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="bg-white rounded-lg border-8 border-amber-400 shadow-2xl p-4">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    {/* Your new landing main image - larger size */}
                    <Image
                      src="/images/landing_main.jpeg"
                      alt="Elderly person enjoying conversation with Aashray AI"
                      width={500}
                      height={400}
                      className="rounded-lg shadow-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 text-6xl opacity-20">💝</div>
              <div className="absolute -bottom-4 -left-4 text-6xl opacity-20">🏡</div>
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-amber-900 font-serif">
                How Aashray AI Helps Elderly People
              </h2>

              <div className="space-y-6 text-lg text-amber-800">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">🗣️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">Daily Conversation</h3>
                    <p>Never feel lonely again. Aashray AI provides engaging, natural conversations about your interests, memories, and daily experiences.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">💊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">Medication Reminders</h3>
                    <p>Stay on track with your medications. Gentle voice reminders ensure you never miss important doses.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">🏥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">Health Monitoring</h3>
                    <p>Regular check-ins about your well-being and the ability to contact caregivers when needed.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">Appointment Reminders</h3>
                    <p>Never miss doctor appointments, family visits, or important events with gentle reminders.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">🎵</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">Entertainment & Activities</h3>
                    <p>Enjoy music, stories, games, and activities tailored to your interests and preferences.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">Emergency Assistance</h3>
                    <p>Quick access to emergency contacts and the ability to call for help when needed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Why Choose Aashray AI?
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Designed specifically for elderly care with compassion, safety, and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Voice-First Design</h3>
              <p className="text-amber-700">
                Easy voice interaction - no typing required. Crystal clear speech recognition and natural responses.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">3D Avatar Companion</h3>
              <p className="text-amber-700">
                Animated 3D avatar with lip-sync technology and natural facial expressions for a more personal experience.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Family Connection</h3>
              <p className="text-amber-700">
                Keep family updated on your well-being and allow them to check in remotely when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Ready to Experience Aashray AI?
          </h2>
          <p className="text-lg text-amber-700 mb-8">
            Join thousands of elderly users who have found companionship, support, and peace of mind with Aashray AI.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-xl px-8 py-4">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}