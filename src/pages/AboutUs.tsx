import { Users, Target, Lightbulb, Award, Heart, Code, Database, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">About CarPredict</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Empowering car buyers and sellers in Denmark with AI-powered insights and transparent market data
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Mission Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                CarPredict was created to bring transparency and intelligence to the Danish used car market. We believe that buying or selling a car should be a confident, informed decision backed by data and AI technology.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform combines real-time market data with advanced machine learning to help you understand true car values, identify great deals, and make smarter automotive decisions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">30K+</div>
                  <div className="text-blue-200">Car Listings</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">742</div>
                  <div className="text-blue-200">Pages of Cars</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">100+</div>
                  <div className="text-blue-200">Car Brands</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-blue-200">Data Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accuracy</h3>
              <p className="text-gray-600">
                We're committed to providing the most accurate price predictions using real market data and advanced AI models.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                No hidden agendas. We show you real market prices and give you all the information you need to decide.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Leveraging cutting-edge machine learning and modern web technologies to solve real-world problems.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User First</h3>
              <p className="text-gray-600">
                Every feature is designed with you in mind. Simple, intuitive, and powerful tools at your fingertips.
              </p>
            </div>
          </div>
        </div>

        {/* The Team Section */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Team Behind CarPredict</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                CarPredict is a Bachelor's Degree project developed by Group 26 at VIA University College, Denmark
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Student Team</h3>
                <p className="text-gray-600">
                  Passionate software engineering students dedicated to creating innovative solutions
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Full-Stack Development</h3>
                <p className="text-gray-600">
                  Expertise in React, TypeScript, Python, Flask, and Machine Learning
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data Engineering</h3>
                <p className="text-gray-600">
                  Building robust data pipelines and scalable database solutions
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Excellence</h3>
                  <p className="text-gray-700 leading-relaxed">
                    This project represents the culmination of our Bachelor's degree in Software Engineering at VIA University College. 
                    It demonstrates our ability to design, develop, and deploy a complete full-stack application with real-world impact, 
                    combining theoretical knowledge with practical implementation skills in web development, data science, and cloud infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Built With Modern Technology</h2>
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-12 text-white">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-300">Frontend Stack</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>React 18 + TypeScript</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Tailwind CSS for styling</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Vite build tool</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Deployed on Netlify</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-300">Backend Stack</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Python Flask REST API</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>PostgreSQL 16 database</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>TensorFlow ML models</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Docker on Raspberry Pi 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Academic Project Details</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-2xl font-bold mb-2">Group 26</div>
                <div className="text-blue-200">Project Team</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">VIA University</div>
                <div className="text-blue-200">Denmark</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">2025</div>
                <div className="text-blue-200">Graduation Year</div>
              </div>
            </div>
            <p className="text-lg text-blue-100 mb-8">
              This platform is part of our Bachelor's thesis project, demonstrating practical application of 
              software engineering principles, full-stack development, machine learning integration, and DevOps practices.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn How It Works
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Academic Project Disclaimer</h2>
            </div>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                This platform is developed as part of a Bachelor's thesis project at VIA University College, Denmark, 
                by Group 26 for the academic year 2024-2025.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg my-6">
                <p className="font-semibold text-blue-900 mb-2">Important Notice:</p>
                <p className="text-blue-800">
                  This project is created solely for educational and demonstration purposes. It is not intended for 
                  commercial use, and no commercial activities or transactions are conducted through this platform.
                </p>
              </div>

              <p>
                The car listings displayed on this platform are scraped from publicly available Danish car marketplaces 
                for research and educational purposes. All data belongs to the respective original sources and dealers. 
                We do not claim ownership of any vehicle listings, images, or pricing information.
              </p>

              <p>
                The AI price predictions provided by this platform are generated using machine learning models trained 
                on historical data and should be considered as <strong>educational estimates only</strong>. These predictions 
                are not professional appraisals and should not be used as the sole basis for making purchasing decisions.
              </p>

              <p>
                <strong>Limitation of Liability:</strong> The developers, contributors, and VIA University College 
                assume no responsibility or liability for:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
                <li>The accuracy, completeness, or reliability of any information displayed on this platform</li>
                <li>Any decisions made based on the price predictions or data provided</li>
                <li>Any technical issues, data inconsistencies, or service interruptions</li>
                <li>Any damages or losses arising from the use of this platform</li>
              </ul>

              <p>
                This platform is provided <strong>"as is"</strong> without any warranties, express or implied. 
                Users are encouraged to verify all information independently through official sources and dealerships 
                before making any purchasing decisions.
              </p>

              <p className="text-sm text-gray-600 pt-4 border-t mt-6">
                For educational inquiries or feedback about this project, please contact VIA University College. 
                This platform may be taken offline after the completion of the academic assessment period.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
