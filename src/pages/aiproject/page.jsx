import React, { useState, useMemo } from 'react';
import { Search, Filter, Heart, ExternalLink, Mail, Calendar, MapPin, Users, Star, Clock, Zap, Building, Globe, Phone, HandHeart, Briefcase } from 'lucide-react';

export default function AiprojectPage() {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectType, setProjectType] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const jobRoles = [
    // Technology/IT
    'Software Developer',
    'Full Stack Developer', 
    'Frontend Developer',
    'Backend Developer',
    'Mobile App Developer',
    'DevOps Engineer',
    'Cloud Architect',
    'System Administrator',
    'Cybersecurity Specialist',
    'Software Architect',
    'Technical Lead',
    'Quality Assurance Engineer',
    
    // Data Science/Analytics
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'AI Engineer',
    'Business Intelligence Analyst',
    'Data Engineer',
    'Research Scientist',
    
    // Digital Marketing
    'Digital Marketing Manager',
    'Social Media Manager',
    'SEO Specialist',
    'Content Marketing Manager',
    'Performance Marketing Manager',
    'Email Marketing Specialist',
    'Growth Hacker',
    'Digital Advertising Manager',
    
    // Product Management
    'Product Manager',
    'Product Owner',
    'Technical Product Manager',
    'Product Marketing Manager',
    'Product Designer',
    
    // Visual Design
    'UI/UX Designer',
    'Graphic Designer',
    'Web Designer',
    'Motion Graphics Designer',
    'Brand Designer',
    'Creative Director',
    
    // E-commerce
    'E-commerce Manager',
    'Marketplace Manager',
    'E-commerce Analyst',
    'Digital Sales Manager',
    
    // Finance/Fintech
    'Fintech Product Manager',
    'Financial Analyst',
    'Blockchain Developer',
    'Cryptocurrency Analyst',
    'Digital Payment Specialist',
    
    // Business Development
    'Business Development Manager',
    'Partnership Manager',
    'Sales Development Representative',
    'Account Manager',
    
    // Consulting
    'IT Consultant',
    'Digital Transformation Consultant',
    'Technology Consultant',
    'Management Consultant',
    
    // Additional Digital Roles
    'Content Creator',
    'Community Manager',
    'Digital Project Manager',
    'Scrum Master',
    'Agile Coach',
    'Technical Writer',
    'Game Developer',
    'AR/VR Developer',
    'IoT Developer',
    'Automation Engineer'
  ];

  const realProjectsData = [
    // UMKM Tech Projects
    {
      id: 1,
      title: 'E-commerce Platform for Traditional Batik Artisans',
      description: 'Help UMKM batik craftsmen in Solo develop an e-commerce platform to reach global markets and increase revenue by up to 300%.',
      organization: 'Batik Sari Asih Cooperative',
      type: 'UMKM',
      categories: ['E-commerce Manager', 'Full Stack Developer', 'UI/UX Designer', 'Digital Marketing Manager'],
      impact: 'Increase revenue for 45 batik artisans',
      urgency: 'High',
      duration: '3-4 months',
      location: 'Solo, Central Java',
      neededSkills: ['React/Vue.js', 'Node.js', 'Payment Gateway', 'SEO', 'Digital Marketing'],
      benefits: ['Real portfolio project', 'Social contribution certificate', 'UMKM networking', 'Reference letter'],
      contactPerson: 'Mrs. Sari Wijayanti',
      email: 'sari.batik@gmail.com',
      phone: '+62 812-3456-7890',
      deadline: '2024-02-15',
      volunteers: 3,
      maxVolunteers: 8,
      postedDate: '2024-01-10',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Financial Management System for Farmer Cooperative',
      description: 'Develop a digital system to manage finances and inventory for 200+ organic vegetable farmers in Lembang, improving transparency and operational efficiency.',
      organization: 'Lestari Bandung Farmer Cooperative',
      type: 'UMKM',
      categories: ['Software Developer', 'Data Analyst', 'Product Manager', 'UI/UX Designer'],
      impact: 'Support 200+ organic farmers',
      urgency: 'Medium',
      duration: '2-3 months',
      location: 'Lembang, Bandung',
      neededSkills: ['Laravel/Django', 'MySQL', 'Data Visualization', 'Financial Modeling'],
      benefits: ['Real project experience', 'Agritech community access', 'Cooperative expert mentoring'],
      contactPerson: 'Mr. Dedi Suryadi',
      email: 'dedisury.koperasi@gmail.com',
      phone: '+62 822-9876-5432',
      deadline: '2024-03-01',
      volunteers: 5,
      maxVolunteers: 10,
      postedDate: '2024-01-08',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Digital Inventory System for Coffee Bean Exporters',
      description: 'Build a comprehensive inventory and supply chain management system for small coffee exporters in Aceh to track bean quality and optimize export processes.',
      organization: 'Aceh Coffee Exporters Union',
      type: 'UMKM',
      categories: ['Backend Developer', 'Data Engineer', 'Supply Chain Analyst', 'Quality Assurance Engineer'],
      impact: 'Improve quality control for 80+ coffee farmers',
      urgency: 'High',
      duration: '4-5 months',
      location: 'Banda Aceh',
      neededSkills: ['Python/Java', 'PostgreSQL', 'Supply Chain Management', 'Quality Control Systems'],
      benefits: ['Agriculture tech portfolio', 'Export industry knowledge', 'International market exposure'],
      contactPerson: 'Mr. Rizki Abdullah',
      email: 'rizki.coffeeunion@gmail.com',
      phone: '+62 813-2468-1357',
      deadline: '2024-03-30',
      volunteers: 2,
      maxVolunteers: 6,
      postedDate: '2024-01-22',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Mobile POS System for Traditional Market Vendors',
      description: 'Create a user-friendly mobile point-of-sale system for traditional market vendors in Jakarta to digitize transactions and improve financial tracking.',
      organization: 'Jakarta Traditional Market Association',
      type: 'UMKM',
      categories: ['Mobile App Developer', 'UI/UX Designer', 'Product Manager', 'Digital Payment Specialist'],
      impact: 'Digitize 500+ traditional market vendors',
      urgency: 'Medium',
      duration: '3-4 months',
      location: 'Jakarta',
      neededSkills: ['React Native', 'Mobile Payment APIs', 'Offline-first Design', 'User Research'],
      benefits: ['FinTech portfolio', 'Traditional market insights', 'Payment system expertise'],
      contactPerson: 'Mrs. Indira Sari',
      email: 'indira.pasar@gmail.com',
      phone: '+62 821-3579-2468',
      deadline: '2024-04-15',
      volunteers: 6,
      maxVolunteers: 12,
      postedDate: '2024-01-25',
      thumbnail: '/api/placeholder/400/250'
    },

    // NGO Education Projects
    {
      id: 5,
      title: 'Interactive Learning Platform for Special Needs Children',
      description: 'Build an accessible interactive learning platform for 500+ special needs children in Jakarta, featuring voice recognition and visual aids.',
      organization: 'Cahaya Harapan Foundation',
      type: 'NGO',
      categories: ['Frontend Developer', 'UI/UX Designer', 'AI Engineer', 'Product Designer'],
      impact: 'Improve education access for 500+ special needs children',
      urgency: 'High',
      duration: '4-6 months',
      location: 'Jakarta',
      neededSkills: ['Accessibility Design', 'React', 'AI/ML', 'Voice Recognition', 'Progressive Web Apps'],
      benefits: ['Real social impact', 'Ministry of Education certificate', 'Impactful portfolio', 'NGO networking'],
      contactPerson: 'Dr. Maya Sari',
      email: 'maya.cahayaharapan@gmail.com',
      phone: '+62 811-2233-4455',
      deadline: '2024-02-28',
      volunteers: 7,
      maxVolunteers: 12,
      postedDate: '2024-01-05',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Donation Transparency Platform with Blockchain',
      description: 'Build a digital donation system with blockchain for full transparency, serving 15 orphanages with 800+ orphaned children across Indonesia.',
      organization: 'Kasih Sayang Nusantara Foundation',
      type: 'NGO',
      categories: ['Blockchain Developer', 'Full Stack Developer', 'Digital Marketing Manager', 'Data Analyst'],
      impact: 'Improve donation transparency for 800+ orphaned children',
      urgency: 'High',
      duration: '3-5 months',
      location: 'Remote (Base: Jakarta)',
      neededSkills: ['Blockchain', 'Smart Contracts', 'React', 'Digital Payment', 'Data Analytics'],
      benefits: ['Blockchain portfolio', 'Social contribution certificate', 'Media exposure', 'Tech for good experience'],
      contactPerson: 'Mr. Ahmad Fadhil',
      email: 'ahmad.kasihsayang@gmail.com',
      phone: '+62 813-5566-7788',
      deadline: '2024-03-15',
      volunteers: 4,
      maxVolunteers: 10,
      postedDate: '2024-01-12',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 7,
      title: 'Digital Library System for Rural Schools',
      description: 'Develop an offline-capable digital library system for 100+ rural schools in East Java, providing access to educational content without reliable internet.',
      organization: 'Rural Education Initiative',
      type: 'NGO',
      categories: ['Software Developer', 'Content Manager', 'Educational Technology Specialist', 'UI/UX Designer'],
      impact: 'Provide digital education access to 10,000+ rural students',
      urgency: 'Medium',
      duration: '5-6 months',
      location: 'Malang, East Java',
      neededSkills: ['Progressive Web Apps', 'Offline Storage', 'Content Management', 'Educational Design'],
      benefits: ['EdTech portfolio', 'Rural development experience', 'Educational impact measurement'],
      contactPerson: 'Mrs. Kartini Dewi',
      email: 'kartini.ruraledu@gmail.com',
      phone: '+62 812-9876-5432',
      deadline: '2024-04-30',
      volunteers: 3,
      maxVolunteers: 8,
      postedDate: '2024-01-28',
      thumbnail: '/api/placeholder/400/250'
    },

    // Disability Community Projects
    {
      id: 8,
      title: 'Inclusive Job Portal for People with Disabilities',
      description: 'Create a fully accessible job search platform with screen reader support and voice navigation to connect 1000+ people with disabilities to inclusive companies.',
      organization: 'Indonesian Disability Community United',
      type: 'Disability Community',
      categories: ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Quality Assurance Engineer'],
      impact: 'Open job access for 1000+ people with disabilities',
      urgency: 'High',
      duration: '4-6 months',
      location: 'Remote',
      neededSkills: ['Web Accessibility (WCAG)', 'Screen Reader Testing', 'Voice Navigation', 'React/Vue', 'Node.js'],
      benefits: ['Accessibility expertise', 'Inclusive design portfolio', 'Impact measurement', 'International recognition'],
      contactPerson: 'Mrs. Rina Disability Rights Advocate',
      email: 'rina.difabelindonesia@gmail.com',
      phone: '+62 814-6677-8899',
      deadline: '2024-04-01',
      volunteers: 6,
      maxVolunteers: 15,
      postedDate: '2024-01-15',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 9,
      title: 'Sign Language Learning App for Deaf Community',
      description: 'Develop an interactive mobile app to teach Indonesian Sign Language (BISINDO) to hearing people, promoting inclusive communication.',
      organization: 'Indonesian Deaf Association',
      type: 'Disability Community',
      categories: ['Mobile App Developer', 'AI Engineer', 'Content Creator', 'Educational Designer'],
      impact: 'Promote sign language learning for better inclusion',
      urgency: 'Medium',
      duration: '4-5 months',
      location: 'Remote',
      neededSkills: ['React Native', 'Computer Vision', 'Educational Content Design', 'Video Processing'],
      benefits: ['AI/ML portfolio', 'Inclusive technology experience', 'Community impact'],
      contactPerson: 'Mr. Budi Hartono',
      email: 'budi.deafassoc@gmail.com',
      phone: '+62 815-3456-7890',
      deadline: '2024-05-15',
      volunteers: 4,
      maxVolunteers: 10,
      postedDate: '2024-02-01',
      thumbnail: '/api/placeholder/400/250'
    },

    // Environmental NGO Projects
    {
      id: 10,
      title: 'Coastal Water Quality Monitoring Platform',
      description: 'IoT system and dashboard for real-time seawater quality monitoring in 20 coastal villages, helping fishermen and coastal communities understand pollution impact.',
      organization: 'Green Coast Indonesia',
      type: 'NGO',
      categories: ['IoT Developer', 'Data Scientist', 'Mobile App Developer', 'Environmental Analyst'],
      impact: 'Protect coastal ecosystems in 20 fishing villages',
      urgency: 'Medium',
      duration: '5-7 months',
      location: 'Cilacap, Central Java',
      neededSkills: ['IoT Sensors', 'Arduino/Raspberry Pi', 'Data Visualization', 'Mobile Development', 'Environmental Science'],
      benefits: ['Tech for environment portfolio', 'Field research experience', 'Environmental impact certificate'],
      contactPerson: 'Dr. Budi Santoso',
      email: 'budi.greencoast@gmail.com',
      phone: '+62 815-9988-7766',
      deadline: '2024-03-20',
      volunteers: 2,
      maxVolunteers: 8,
      postedDate: '2024-01-18',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 11,
      title: 'Forest Fire Early Warning System',
      description: 'Develop a satellite-based early warning system for forest fires in Kalimantan using AI and real-time data processing to prevent environmental disasters.',
      organization: 'Borneo Forest Protection Alliance',
      type: 'NGO',
      categories: ['AI Engineer', 'Data Scientist', 'Satellite Data Analyst', 'DevOps Engineer'],
      impact: 'Protect 1 million hectares of rainforest',
      urgency: 'High',
      duration: '6-8 months',
      location: 'Remote (Field visits to Kalimantan)',
      neededSkills: ['Satellite Imagery Processing', 'Machine Learning', 'Real-time Systems', 'Geographic Information Systems'],
      benefits: ['Environmental AI portfolio', 'Satellite technology experience', 'Global impact recognition'],
      contactPerson: 'Dr. Sarah Environmental',
      email: 'sarah.forestprotect@gmail.com',
      phone: '+62 816-4567-8901',
      deadline: '2024-04-20',
      volunteers: 1,
      maxVolunteers: 6,
      postedDate: '2024-02-05',
      thumbnail: '/api/placeholder/400/250'
    },

    // Social Enterprise Projects
    {
      id: 12,
      title: 'Recycled Products Marketplace Platform',
      description: 'E-marketplace specifically for recycled and upcycled products from 100+ partner UMKMs, creating circular economy and reducing waste by 50 tons/month.',
      organization: 'EcoCycle Social Enterprise',
      type: 'Social Enterprise',
      categories: ['E-commerce Manager', 'Sustainability Analyst', 'Digital Marketing Manager', 'Content Creator'],
      impact: 'Reduce waste by 50 tons/month, empower 100+ UMKMs',
      urgency: 'Medium',
      duration: '3-4 months',
      location: 'Surabaya',
      neededSkills: ['E-commerce Platform', 'Sustainability Metrics', 'Content Marketing', 'Community Building'],
      benefits: ['Green tech portfolio', 'Sustainability certification', 'Impact entrepreneurship experience'],
      contactPerson: 'Mrs. Eco Prameswari',
      email: 'eco.ecocycle@gmail.com',
      phone: '+62 816-1122-3344',
      deadline: '2024-04-10',
      volunteers: 8,
      maxVolunteers: 12,
      postedDate: '2024-01-20',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 13,
      title: 'Microfinance Platform for Women Entrepreneurs',
      description: 'Digital lending platform connecting women entrepreneurs with micro-investors, featuring risk assessment algorithms and transparent impact tracking.',
      organization: 'Women Economic Empowerment Initiative',
      type: 'Social Enterprise',
      categories: ['Fintech Product Manager', 'Full Stack Developer', 'Data Scientist', 'Risk Analyst'],
      impact: 'Support 1000+ women entrepreneurs access to capital',
      urgency: 'High',
      duration: '5-6 months',
      location: 'Remote',
      neededSkills: ['Financial Technology', 'Risk Assessment', 'Regulatory Compliance', 'Impact Measurement'],
      benefits: ['Fintech portfolio', 'Gender equality impact', 'Microfinance expertise'],
      contactPerson: 'Mrs. Ratna Entrepreneur',
      email: 'ratna.womenempowerment@gmail.com',
      phone: '+62 817-2345-6789',
      deadline: '2024-05-30',
      volunteers: 3,
      maxVolunteers: 10,
      postedDate: '2024-02-10',
      thumbnail: '/api/placeholder/400/250'
    },

    // Health & Community Projects
    {
      id: 14,
      title: 'Telemedicine Platform for Remote Villages',
      description: 'Build a telemedicine platform connecting remote villages with healthcare professionals, featuring offline diagnosis capabilities and health record management.',
      organization: 'Rural Health Access Foundation',
      type: 'NGO',
      categories: ['Full Stack Developer', 'Mobile App Developer', 'Health Tech Specialist', 'UI/UX Designer'],
      impact: 'Provide healthcare access to 50,000+ rural residents',
      urgency: 'High',
      duration: '6-8 months',
      location: 'Remote (Test deployment in Papua)',
      neededSkills: ['HIPAA Compliance', 'Mobile Health Apps', 'Offline Synchronization', 'Medical Data Systems'],
      benefits: ['HealthTech portfolio', 'Medical technology experience', 'Rural development impact'],
      contactPerson: 'Dr. Agus Medical',
      email: 'agus.ruralhealth@gmail.com',
      phone: '+62 818-3456-7890',
      deadline: '2024-06-15',
      volunteers: 5,
      maxVolunteers: 15,
      postedDate: '2024-02-12',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: 15,
      title: 'Mental Health Support Chatbot for Youth',
      description: 'AI-powered chatbot providing mental health support and crisis intervention for Indonesian youth, with multilingual support and professional referral system.',
      organization: 'Youth Mental Health Alliance',
      type: 'NGO',
      categories: ['AI Engineer', 'Psychology Consultant', 'Chatbot Developer', 'Mental Health Specialist'],
      impact: 'Support mental health for 10,000+ young people',
      urgency: 'High',
      duration: '4-5 months',
      location: 'Remote',
      neededSkills: ['Natural Language Processing', 'Psychology Knowledge', 'Crisis Intervention Protocols', 'Multi-language Support'],
      benefits: ['AI for social good portfolio', 'Mental health awareness', 'Youth advocacy experience'],
      contactPerson: 'Dr. Lisa Psychology',
      email: 'lisa.youthmh@gmail.com',
      phone: '+62 819-4567-8901',
      deadline: '2024-05-01',
      volunteers: 6,
      maxVolunteers: 12,
      postedDate: '2024-02-08',
      thumbnail: '/api/placeholder/400/250'
    }
  ];

  const filteredProjects = useMemo(() => {
    return realProjectsData.filter(project => {
      const matchesCareer = !selectedCareer || 
        project.categories.includes(selectedCareer);
      
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.neededSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = !projectType || 
        project.type === projectType;
      
      const matchesLocation = !location ||
        project.location.toLowerCase().includes(location.toLowerCase());
      
      return matchesCareer && matchesSearch && matchesType && matchesLocation;
    });
  }, [selectedCareer, searchQuery, projectType, location]);

  const ProjectCard = ({ project }) => (
    <div className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            project.type === 'UMKM' ? 'bg-orange-500 text-white' :
            project.type === 'NGO' ? 'bg-green-500 text-white' :
            project.type === 'Disability Community' ? 'bg-purple-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {project.type}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            project.urgency === 'High' ? 'bg-red-500 text-white' :
            project.urgency === 'Medium' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {project.urgency}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg line-clamp-2 mb-2">{project.title}</h3>
          <p className="text-blue-100 text-sm font-medium">{project.organization}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-blue-600 text-sm font-medium mb-3">
          <Heart className="w-4 h-4 mr-2" />
          {project.impact}
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {project.duration}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {project.location}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {project.volunteers}/{project.maxVolunteers} volunteers
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Deadline: {new Date(project.deadline).toLocaleDateString('en-US')}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {project.neededSkills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            ))}
            {project.neededSkills.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                +{project.neededSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">Portfolio Benefits:</p>
          <ul className="text-xs text-blue-700">
            {project.benefits.slice(0, 2).map((benefit, idx) => (
              <li key={idx}>• {benefit}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
            <HandHeart className="w-4 h-4 mr-2" />
            Join Project
          </button>
          <button className="p-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors" title="Contact">
            <Mail className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors" title="Details">
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Briefcase className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              Social Impact Projects
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto">
            Build meaningful portfolios by contributing directly to UMKMs, NGOs, and social communities. 
            Develop your skills while creating real positive impact for society.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Building className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-slate-600">{realProjectsData.filter(p => p.type === 'UMKM').length} UMKM Projects</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-slate-600">{realProjectsData.filter(p => p.type === 'NGO').length} NGO Projects</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-slate-600">{realProjectsData.filter(p => p.type.includes('Disability')).length} Disability Projects</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by project name, organization, or required skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Career Filter */}
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[200px]"
            >
              <option value="">All Skill Areas</option>
              {jobRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            {/* Project Type Filter */}
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Types</option>
              <option value="UMKM">UMKM</option>
              <option value="NGO">NGO</option>
              <option value="Disability Community">Disability Community</option>
              <option value="Social Enterprise">Social Enterprise</option>
            </select>
            
            {/* Location Filter */}
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
            />
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {selectedCareer ? `Projects for ${selectedCareer}` : 'Real Social Impact Projects'}
            </h2>
            <p className="text-slate-600 mt-1">
              {filteredProjects.length} projects available
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSelectedCareer('');
                setSearchQuery('');
                setProjectType('');
                setLocation('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Impact Stats */}
        <div className="glass-card rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
            Real Impact from Program Alumni
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-slate-600">Talents Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-slate-600">UMKMs Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-slate-600">NGO Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-slate-600">Get Jobs After Program</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="glass-card rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
            How It Works?
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-slate-800 mb-2">1. Choose Project</h4>
              <p className="text-slate-600 text-sm">
                Browse and select projects that match your skills and passion.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-slate-800 mb-2">2. Apply & Match</h4>
              <p className="text-slate-600 text-sm">
                Apply to projects and get matched with the right organizations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-slate-800 mb-2">3. Work on Project</h4>
              <p className="text-slate-600 text-sm">
                Work on real projects with full mentoring and community support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-slate-800 mb-2">4. Build Portfolio</h4>
              <p className="text-slate-600 text-sm">
                Get quality portfolio, certificates, and reference letters for your career.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
