import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';
import '../styles/global.css';

const Landing = () => {
  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: 'white' }}>
      {/* Hero Section */}
      <section
        className="landing-hero"
        style={{
          background: 'var(--primary)',
          padding: '120px 24px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h1
            className="landing-title"
            style={{
              fontSize: '56px',
              fontWeight: '800',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}
          >
            Bridge Your Skills to
            <br />
            Your Dream Internship
          </h1>
          <p
            style={{
              fontSize: '20px',
              marginBottom: '40px',
              opacity: 0.95,
              maxWidth: '700px',
              margin: '0 auto 40px'
            }}
          >
            SkillBridge connects talented students with top companies. Build your profile,
            showcase your skills, and land the internship you deserve.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-lg"
              style={{
                background: 'white',
                color: 'var(--primary)',
                padding: '16px 40px',
                textDecoration: 'none'
              }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="btn btn-lg btn-secondary"
              style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '16px 40px',
                textDecoration: 'none'
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 24px', background: 'var(--light)' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: '32px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <Users size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 8px' }}>
                50K+
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Active Students</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <Briefcase size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 8px' }}>
                10K+
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Internships Listed</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <Star size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 8px' }}>
                500+
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Partner Companies</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <TrendingUp size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 8px' }}>
                85%
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>
              Everything You Need to Succeed
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--gray)', maxWidth: '600px', margin: '0 auto' }}>
              Powerful tools to help you build your career and stand out from the competition
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '32px' }}>
            <div className="card">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: '#e0e7ff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}
              >
                <GraduationCap size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Skill Management
              </h3>
              <p style={{ color: 'var(--gray)', lineHeight: '1.6' }}>
                Track and showcase your technical skills with proficiency levels. Get
                personalized recommendations based on your skill set.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: '#e0e7ff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}
              >
                <Briefcase size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Internship Discovery
              </h3>
              <p style={{ color: 'var(--gray)', lineHeight: '1.6' }}>
                Browse thousands of internships from top companies. Advanced filters help
                you find the perfect match for your skills and interests.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: '#e0e7ff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}
              >
                <TrendingUp size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Application Tracking
              </h3>
              <p style={{ color: 'var(--gray)', lineHeight: '1.6' }}>
                Keep track of all your applications in one place. Get real-time updates on
                your application status and never miss an opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="landing-cta"
        style={{
          background: 'var(--primary-dark)',
          padding: '100px 24px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '24px' }}>
            Ready to Launch Your Career?
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.95 }}>
            Join thousands of students who have already found their dream internships
            through SkillBridge. It's free to get started.
          </p>
          <Link
            to="/register"
            className="btn btn-lg"
            style={{
              background: 'white',
              color: 'var(--primary)',
              padding: '16px 48px',
              textDecoration: 'none'
            }}
          >
            Create Your Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--dark)', color: 'white', padding: '60px 24px 24px' }}>
        <div className="container">
          <div className="grid grid-4" style={{ marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <GraduationCap size={32} />
                <h3 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>SkillBridge</h3>
              </div>
              <p style={{ color: 'var(--gray)', lineHeight: '1.6' }}>
                Connecting talented students with amazing internship opportunities worldwide.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Features</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Pricing</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>For Companies</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Blog</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Help Center</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Career Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>About Us</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Contact</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--gray)', paddingTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray)', margin: 0 }}>
              © 2024 SkillBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
