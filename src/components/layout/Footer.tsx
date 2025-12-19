import React from 'react'
import Image from 'next/image'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-amber-50 border-t-4 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info with Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/aashray_logo.png"
                alt="Aashray AI Logo"
                width={180}
                height={120}
                className="rounded-lg"
              />
              
            </div>
            <p className="text-sm text-amber-800">
              AI-powered voice companion providing emotional support and meaningful conversations for elderly users.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/companion" className="text-base text-amber-700 hover:text-amber-600 transition-colors">
                  Start Conversation
                </a>
              </li>
              <li>
                <a href="/profile" className="text-base text-amber-700 hover:text-amber-600 transition-colors">
                  Profile Settings
                </a>
              </li>
              <li>
                <a href="/help" className="text-base text-amber-700 hover:text-amber-600 transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:aashray@gmail.com" className="text-base text-amber-700 hover:text-amber-600 transition-colors">
                  aashray@gmail.com
                </a>
              </li>
              <li>
                <span className="text-base text-amber-700">
                  Phone: 91111
                </span>
              </li>
              <li>
                <span className="text-base text-amber-700">
                  Emergency: 911
                </span>
              </li>
            </ul>
            
            <div className="pt-4 border-t border-amber-200">
              <p className="text-sm text-amber-600">
                © {currentYear} Aashray AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}