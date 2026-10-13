// Role-to-skills mapping configuration
// This defines the expected skill sets for various job roles
const roleSkillMap = {
  'Frontend Developer': {
    required: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
    preferred: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Git', 'Testing'],
    description: 'Build user interfaces and web applications',
    learningRoadmap: [
      {
        topic: 'HTML & CSS Fundamentals',
        priority: 'High',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Build 5 different landing pages', 'Create responsive layouts', 'Master CSS Grid and Flexbox'],
        resources: ['MDN Web Docs', 'CSS Tricks', 'freeCodeCamp']
      },
      {
        topic: 'JavaScript Core',
        priority: 'High',
        estimatedTime: '4-6 weeks',
        practiceTasks: ['Build interactive widgets', 'Create DOM manipulation projects', 'Implement algorithms in JS'],
        resources: ['JavaScript.info', 'Eloquent JavaScript', 'JavaScript30']
      },
      {
        topic: 'React Fundamentals',
        priority: 'High',
        estimatedTime: '4-5 weeks',
        practiceTasks: ['Build a todo app', 'Create a weather app', 'Build a portfolio site'],
        resources: ['React Documentation', 'Scrimba React Course', 'React Tutorial']
      },
      {
        topic: 'TypeScript',
        priority: 'Medium',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Convert JS projects to TypeScript', 'Build a typed API client', 'Create React components with types'],
        resources: ['TypeScript Handbook', 'Total TypeScript', 'TypeScript Deep Dive']
      },
      {
        topic: 'State Management',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Implement Redux', 'Use Context API', 'Build a shopping cart'],
        resources: ['Redux Toolkit Tutorial', 'Zustand Docs', 'Recoil Docs']
      },
      {
        topic: 'Testing',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Write unit tests with Jest', 'Test React components', 'Implement E2E tests'],
        resources: ['Testing Library Docs', 'Jest Docs', 'Cypress Docs']
      }
    ]
  },
  'Backend Developer': {
    required: ['Node.js', 'JavaScript', 'SQL', 'API Design'],
    preferred: ['Express', 'MongoDB', 'Docker', 'AWS', 'Authentication'],
    description: 'Build server-side applications and APIs',
    learningRoadmap: [
      {
        topic: 'Node.js Fundamentals',
        priority: 'High',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Build a CLI tool', 'Create a file server', 'Build a REST API'],
        resources: ['Node.js Docs', 'NodeSchool', 'The Node Beginner Book']
      },
      {
        topic: 'Express.js Framework',
        priority: 'High',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Build a CRUD API', 'Implement middleware', 'Add authentication'],
        resources: ['Express Docs', 'Express Tutorial', 'REST API Tutorial']
      },
      {
        topic: 'Database Design',
        priority: 'High',
        estimatedTime: '4-5 weeks',
        practiceTasks: ['Design database schemas', 'Write complex SQL queries', 'Implement relationships'],
        resources: ['PostgreSQL Tutorial', 'MongoDB University', 'SQLBolt']
      },
      {
        topic: 'API Design & REST',
        priority: 'High',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Design RESTful APIs', 'Implement pagination', 'Add API versioning'],
        resources: ['REST API Tutorial', 'API Design Best Practices', 'OpenAPI Spec']
      },
      {
        topic: 'Authentication & Security',
        priority: 'High',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Implement JWT auth', 'Add OAuth2', 'Secure API endpoints'],
        resources: ['OWASP Guide', 'JWT.io', 'Auth0 Docs']
      },
      {
        topic: 'Docker & Deployment',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Containerize an app', 'Build multi-container apps', 'Deploy to cloud'],
        resources: ['Docker Docs', 'Docker Tutorial', 'Kubernetes Basics']
      }
    ]
  },
  'Full Stack Developer': {
    required: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git'],
    preferred: ['TypeScript', 'MongoDB', 'AWS', 'Docker', 'Testing'],
    description: 'Build complete web applications from frontend to backend',
    learningRoadmap: [
      {
        topic: 'Frontend Development',
        priority: 'High',
        estimatedTime: '6-8 weeks',
        practiceTasks: ['Build React applications', 'Implement state management', 'Master responsive design'],
        resources: ['React Docs', 'freeCodeCamp', 'Frontend Masters']
      },
      {
        topic: 'Backend Development',
        priority: 'High',
        estimatedTime: '6-8 weeks',
        practiceTasks: ['Build REST APIs', 'Design databases', 'Implement authentication'],
        resources: ['Node.js Docs', 'Express Tutorial', 'MongoDB University']
      },
      {
        topic: 'Database Management',
        priority: 'High',
        estimatedTime: '4-5 weeks',
        practiceTasks: ['Design schemas', 'Write queries', 'Optimize performance'],
        resources: ['PostgreSQL Tutorial', 'MongoDB Docs', 'Database Design Course']
      },
      {
        topic: 'DevOps Basics',
        priority: 'Medium',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Use Git workflows', 'Containerize apps', 'CI/CD pipelines'],
        resources: ['Git Docs', 'Docker Tutorial', 'GitHub Actions']
      },
      {
        topic: 'API Integration',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Consume APIs', 'Build API clients', 'Handle errors'],
        resources: ['REST API Guide', 'Axios Docs', 'Fetch API']
      }
    ]
  },
  'Data Analyst': {
    required: ['SQL', 'Python', 'Excel', 'Data Visualization'],
    preferred: ['Tableau', 'Power BI', 'Statistics', 'Pandas'],
    description: 'Analyze data to drive business decisions',
    learningRoadmap: [
      {
        topic: 'SQL Fundamentals',
        priority: 'High',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Write complex queries', 'Join multiple tables', 'Aggregate data'],
        resources: ['SQLBolt', 'Mode Analytics SQL Tutorial', 'LeetCode Database']
      },
      {
        topic: 'Python for Data Analysis',
        priority: 'High',
        estimatedTime: '4-5 weeks',
        practiceTasks: ['Clean datasets', 'Analyze data with Pandas', 'Automate reports'],
        resources: ['Pandas Docs', 'Python for Data Analysis', 'DataCamp']
      },
      {
        topic: 'Data Visualization',
        priority: 'High',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Create charts', 'Build dashboards', 'Tell stories with data'],
        resources: ['Tableau Public', 'D3.js', 'Matplotlib Tutorial']
      },
      {
        topic: 'Statistics',
        priority: 'Medium',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Calculate metrics', 'Run A/B tests', 'Interpret results'],
        resources: ['Khan Academy Statistics', 'Statistics How To', 'Practical Statistics']
      },
      {
        topic: 'Excel Advanced',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Pivot tables', 'Formulas', 'Data cleaning'],
        resources: ['Excel Easy', 'Microsoft Excel Training', 'Excel Jet']
      }
    ]
  },
  'Software Engineer': {
    required: ['JavaScript', 'Python', 'Data Structures', 'Algorithms'],
    preferred: ['System Design', 'Testing', 'Git', 'API Design'],
    description: 'Design and build software systems',
    learningRoadmap: [
      {
        topic: 'Data Structures & Algorithms',
        priority: 'High',
        estimatedTime: '8-10 weeks',
        practiceTasks: ['Solve LeetCode problems', 'Implement data structures', 'Optimize code'],
        resources: ['LeetCode', 'HackerRank', 'Cracking the Coding Interview']
      },
      {
        topic: 'System Design',
        priority: 'High',
        estimatedTime: '4-5 weeks',
        practiceTasks: ['Design scalable systems', 'Choose databases', 'Plan architecture'],
        resources: ['System Design Primer', 'Designing Data-Intensive Apps', 'High Scalability']
      },
      {
        topic: 'Software Architecture',
        priority: 'Medium',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Design patterns', 'Microservices', 'Monolith vs microservices'],
        resources: ['Refactoring Guru', 'Clean Architecture', 'Software Architecture']
      },
      {
        topic: 'Testing & Quality',
        priority: 'Medium',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Write unit tests', 'Integration tests', 'TDD practice'],
        resources: ['Testing Library', 'Jest Docs', 'Test-Driven Development']
      },
      {
        topic: 'Version Control',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Git workflows', 'Branch management', 'Code reviews'],
        resources: ['Git Docs', 'GitHub Skills', 'Atlassian Git Tutorial']
      }
    ]
  },
  'UI/UX Designer': {
    required: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    preferred: ['Design Systems', 'Interaction Design', 'User Testing', 'CSS'],
    description: 'Design beautiful and intuitive user experiences',
    learningRoadmap: [
      {
        topic: 'Design Fundamentals',
        priority: 'High',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Study color theory', 'Learn typography', 'Practice layout'],
        resources: ['Refactoring UI', 'Design Principles', 'Canva Design School']
      },
      {
        topic: 'Figma Mastery',
        priority: 'High',
        estimatedTime: '4-5 weeks',
        practiceTasks: ['Build UI kits', 'Create prototypes', 'Design systems'],
        resources: ['Figma Academy', 'Figma Community', 'Design Systems']
      },
      {
        topic: 'UX Research',
        priority: 'High',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Conduct user interviews', 'Create personas', 'Usability testing'],
        resources: ['Nielsen Norman Group', 'UX Research Methods', 'UserTesting']
      },
      {
        topic: 'Prototyping',
        priority: 'Medium',
        estimatedTime: '2-3 weeks',
        practiceTasks: ['Interactive prototypes', 'Animation', 'Micro-interactions'],
        resources: ['Figma Prototyping', 'Principle', 'ProtoPie']
      },
      {
        topic: 'Design Systems',
        priority: 'Medium',
        estimatedTime: '3-4 weeks',
        practiceTasks: ['Build component library', 'Documentation', 'Handoff to devs'],
        resources: ['Design Systems', 'Component Library', 'Design Handoff']
      }
    ]
  }
};

module.exports = roleSkillMap;
