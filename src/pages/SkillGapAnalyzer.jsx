import { useState, useEffect, useCallback } from 'react';
import { skillGapAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Clock, 
  Loader2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import Toast from '../components/Toast';
import '../styles/global.css';

const SkillGapAnalyzer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await skillGapAPI.getAvailableRoles();
      setRoles(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load available roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRoles();
  }, [user, navigate, fetchRoles]);

  const handleAnalyze = async () => {
    if (!selectedRole) {
      setToast({ message: 'Please select a target role', type: 'error' });
      return;
    }

    setAnalyzing(true);
    try {
      const response = await skillGapAPI.analyze({ targetRole: selectedRole });
      setAnalysis(response.data);
      setToast({ message: 'Skill gap analysis complete', type: 'success' });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to analyze skill gap');
      setToast({ message: 'Failed to analyze skills', type: 'error' });
    } finally {
      setAnalyzing(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 70) return '#10b981';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading Skill Gap Analyzer...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
          AI Skill Gap Analyzer
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
          Understand which skills you need to learn for your target role
        </p>
      </div>

      {/* Role Selection */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
          Select Target Role
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {roles.map((role) => (
            <button
              type="button"
              key={role.name}
              onClick={() => setSelectedRole(role.name)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
                padding: '20px',
                border: '2px solid',
                borderColor: selectedRole === role.name ? 'var(--primary)' : 'var(--gray-light)',
                borderRadius: '12px',
                cursor: 'pointer',
                background: selectedRole === role.name ? '#e0e7ff' : 'white',
                transition: 'all 0.2s ease',
                color: 'var(--dark)'
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== role.name) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== role.name) {
                  e.currentTarget.style.borderColor = 'var(--gray-light)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Target size={24} color={selectedRole === role.name ? 'var(--primary)' : 'var(--gray)'} />
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  {role.name}
                </h4>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>
                {role.description}
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!selectedRole || analyzing}
          className="btn btn-primary"
          style={{ minWidth: '200px', opacity: (!selectedRole || analyzing) ? 0.6 : 1 }}
        >
          {analyzing ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
              Analyzing...
            </>
          ) : (
            <>
              <Brain size={18} style={{ marginRight: '8px' }} />
              Analyze Skills
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            Analysis Failed
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={handleAnalyze} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {analysis && (
        <>
          {/* Match Percentage */}
          <div className="card" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
              Skill Match for {analysis.targetRole}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: `conic-gradient(${getMatchColor(analysis.matchPercentage)} ${analysis.matchPercentage}%, var(--gray-light) 0)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '36px', fontWeight: '700', color: getMatchColor(analysis.matchPercentage) }}>
                      {analysis.matchPercentage}%
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>
                  {analysis.matchedRequired.length} of {analysis.requiredSkills.length} required skills matched
                </p>
              </div>
              <div style={{ textAlign: 'left', minWidth: '300px' }}>
                <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>{analysis.matchedRequired.length}</span> skills you already have
                </p>
                <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>
                  <span style={{ color: '#ef4444', fontWeight: '600' }}>{analysis.missingRequired.length}</span> required skills to learn
                </p>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>
                  <span style={{ color: '#f59e0b', fontWeight: '600' }}>{analysis.missingPreferred.length}</span> preferred skills to improve
                </p>
              </div>
            </div>
          </div>

          {/* Current Skills */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
              Your Current Skills
            </h3>
            {analysis.currentSkills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.currentSkills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '8px 16px',
                      background: '#e0e7ff',
                      color: 'var(--primary)',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--gray)' }}>No skills added yet. Add skills to your profile to get better analysis.</p>
            )}
          </div>

          {/* Matched Skills */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={24} color="#10b981" />
              Matched Required Skills
            </h3>
            {analysis.matchedRequired.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.matchedRequired.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '8px 16px',
                      background: '#d1fae5',
                      color: '#10b981',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--gray)' }}>No required skills matched yet.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={24} color="#ef4444" />
              Missing Required Skills
            </h3>
            {analysis.missingRequired.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.missingRequired.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '8px 16px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: '#10b981', fontWeight: '600' }}>You have all required skills! Great job!</p>
            )}
          </div>

          {/* Learning Roadmap */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={24} color="var(--primary)" />
              Personalized Learning Roadmap
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysis.learningRoadmap.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    border: '1px solid var(--gray-light)',
                    borderRadius: '12px',
                    background: 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      {item.topic}
                    </h4>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: item.priority === 'High' ? '#fee2e2' : '#fef3c7',
                        color: item.priority === 'High' ? '#ef4444' : '#f59e0b'
                      }}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--gray)', fontSize: '14px' }}>
                    <Clock size={16} />
                    <span>Estimated: {item.estimatedTime}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
                      Practice Tasks:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--gray)' }}>
                      {item.practiceTasks.map((task, taskIndex) => (
                        <li key={taskIndex}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
                      Resources:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {item.resources.map((resource, resourceIndex) => (
                        <span
                          key={resourceIndex}
                          style={{
                            padding: '6px 12px',
                            background: '#e0e7ff',
                            color: 'var(--primary)',
                            borderRadius: '16px',
                            fontSize: '13px'
                          }}
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Internships */}
          {analysis.relevantInternships.length > 0 && (
            <div className="card" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color="var(--primary)" />
                Relevant Internships for You
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {analysis.relevantInternships.map((internship) => (
                  <div
                    key={internship.id}
                    style={{
                      padding: '16px',
                      border: '1px solid var(--gray-light)',
                      borderRadius: '12px',
                      background: 'white'
                    }}
                  >
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {internship.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>
                      {internship.company}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '8px' }}>
                      {internship.location} • {internship.workMode}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '12px' }}>
                      {internship.stipend}
                    </p>
                    <button
                      onClick={() => navigate(`/internships/${internship.id}`)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Source */}
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--gray)', fontSize: '13px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Brain size={14} />
              Analysis powered by rule-based skill mapping • {analysis.analysisSource}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;
