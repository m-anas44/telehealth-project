import React from 'react';
import { Shield, Lock, CheckCircle2, Calendar, MessageSquare, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#f0f9ff]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0891b2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">HealthConnect</h3>
              <p className="text-xs text-gray-500">Telehealth Platform</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              Login
            </Button>
            <Button className="bg-[#0891b2] hover:bg-[#0e7490]">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1 bg-[#e0f2fe] text-[#0891b2] rounded-full mb-4">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure & HIPAA Compliant
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Healthcare Made <span className="text-[#0891b2]">Simple</span> & <span className="text-[#10b981]">Accessible</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with verified doctors, manage your health records, and get quality care from anywhere. Your health journey starts here.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-[#0891b2] hover:bg-[#0e7490]">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button size="lg" variant="outline">
                Login to Portal
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1758691461916-dc7894eb8f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwdGVsZWhlYWx0aHxlbnwxfHx8fDE3Njg1MDc3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Telehealth consultation"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">10,000+</p>
                <p className="text-sm text-gray-500">Happy Patients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-y">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#e0f2fe] rounded-lg flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-[#0891b2]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Medical Records</h3>
                <p className="text-gray-600">End-to-end encrypted health data with HIPAA compliance. Your privacy is our priority.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#d1fae5] rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Doctors</h3>
                <p className="text-gray-600">All healthcare providers are licensed, verified, and experienced professionals.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#f3e8ff] rounded-lg flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Access healthcare anytime with our secure messaging and telehealth platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Better Health</h2>
          <p className="text-xl text-gray-600">Comprehensive telehealth and EHR platform designed for patients and providers</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-[#0891b2] transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#e0f2fe] rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#0891b2]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book appointments with verified doctors in just a few clicks.</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-[#10b981] transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#d1fae5] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Digital Records</h3>
              <p className="text-gray-600">Store and access your medical documents securely from anywhere.</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-[#8b5cf6] transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#f3e8ff] rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Messaging</h3>
              <p className="text-gray-600">Chat directly with your healthcare provider in a HIPAA-compliant environment.</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-[#f59e0b] transition-colors relative">
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 px-2 py-1 bg-[#f59e0b] text-white text-xs rounded">
                Coming Soon
              </div>
              <div className="w-12 h-12 bg-[#fef3c7] rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600">Voice-powered appointment booking and health insights.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-[#0891b2] to-[#10b981] py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of patients receiving quality care from verified doctors</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">© 2026 HealthConnect. All rights reserved.</p>
            <div className="flex gap-6 text-gray-600">
              <a href="#" className="hover:text-[#0891b2]">Privacy Policy</a>
              <a href="#" className="hover:text-[#0891b2]">Terms of Service</a>
              <a href="#" className="hover:text-[#0891b2]">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage