import { PrismaClient } from '@prisma/client'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Seed data for Indian colleges - trying to keep it realistic
// Some data might not be 100% accurate but close enough for demo purposes

async function main() {
  console.log('Starting seed...')

  // Clear existing data first
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.savedCollege.deleteMany()
  await prisma.college.deleteMany()

  const colleges = [
    // IITs - Top tier engineering
    {
      name: 'Indian Institute of Technology Bombay',
      slug: 'iit-bombay',
      city: 'Mumbai',
      state: 'Maharashtra',
      established: 1958,
      about: 'IIT Bombay is one of the premier engineering institutes in India. Located in Powai, Mumbai, it has consistently been ranked among the top engineering colleges in the country. The institute offers undergraduate, postgraduate, and doctoral programs in various engineering disciplines.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.8,
      examAccepted: ['JEE Advanced', 'GATE', 'CAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '550 acres',
      website: 'https://www.iitb.ac.in',
      placementAvg: 1800000,
      placementHighest: 35000000,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'McKinsey'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 125000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Electrical Engineering', duration: '4 years', annualFees: 125000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'M.Tech Computer Science', duration: '2 years', annualFees: 150000, eligibility: 'GATE', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rahul Sharma', rating: 5, content: 'Amazing campus and faculty. The placements are top-notch.', yearOfPassing: 2023 },
        { reviewerName: 'Priya Patel', rating: 4, content: 'Great academics but the hostel food could be better.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Indian Institute of Technology Delhi',
      slug: 'iit-delhi',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1961,
      about: 'IIT Delhi is a public engineering institution located in Hauz Khas, Delhi. It is one of the oldest IITs and has a strong reputation for research and innovation. The institute has produced many notable alumni who have made significant contributions to various fields.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.7,
      examAccepted: ['JEE Advanced', 'GATE', 'CAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '325 acres',
      website: 'https://www.iitd.ac.in',
      placementAvg: 1700000,
      placementHighest: 32000000,
      topRecruiters: ['Google', 'Microsoft', 'Flipkart', 'Bajaj Auto', 'Oracle'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Mechanical Engineering', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Amit Kumar', rating: 5, content: 'Best decision of my life. The network here is incredible.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Indian Institute of Technology Madras',
      slug: 'iit-madras',
      city: 'Chennai',
      state: 'Tamil Nadu',
      established: 1959,
      about: 'IIT Madras is a public engineering and research institution located in Chennai, Tamil Nadu. It is recognized as an Institute of National Importance and has been consistently ranked among the top engineering institutes in India.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.7,
      examAccepted: ['JEE Advanced', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '620 acres',
      website: 'https://www.iitm.ac.in',
      placementAvg: 1600000,
      placementHighest: 28000000,
      topRecruiters: ['Google', 'Amazon', 'Zoho', 'TCS', 'Infosys'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 115000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Civil Engineering', duration: '4 years', annualFees: 115000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Suresh R', rating: 4, content: 'Great research opportunities. Faculty is very supportive.', yearOfPassing: 2022 },
      ]
    },
    // NITs - Good tier engineering
    {
      name: 'National Institute of Technology Trichy',
      slug: 'nit-trichy',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      established: 1964,
      about: 'NIT Trichy is one of the premier NITs in India, located in Tamil Nadu. It has a strong reputation for engineering education and research. The campus is known for its beautiful setting and excellent infrastructure.',
      feesMin: 80000,
      feesMax: 150000,
      overallRating: 4.5,
      examAccepted: ['JEE Main', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A+'],
      campusSize: '800 acres',
      website: 'https://www.nitt.edu',
      placementAvg: 1200000,
      placementHighest: 18000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Zoho'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 85000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 85000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Karthik S', rating: 4, content: 'Solid college with good placements. The campus life is fun.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'National Institute of Technology Karnataka',
      slug: 'nit-karnataka',
      city: 'Surathkal',
      state: 'Karnataka',
      established: 1960,
      about: 'NITK Surathkal is located on the coast of Karnataka and is known for its excellent engineering programs. The institute has a strong placement record and beautiful campus by the beach.',
      feesMin: 80000,
      feesMax: 150000,
      overallRating: 4.4,
      examAccepted: ['JEE Main', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A+'],
      campusSize: '295 acres',
      website: 'https://www.nitk.ac.in',
      placementAvg: 1100000,
      placementHighest: 15000000,
      topRecruiters: ['Microsoft', 'Amazon', 'Cisco', 'Juniper', 'Qualcomm'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 80000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Information Technology', duration: '4 years', annualFees: 80000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rohan D', rating: 4, content: 'Beach campus is amazing. Placements are decent for core companies.', yearOfPassing: 2022 },
      ]
    },
    // IIMs - Top tier management
    {
      name: 'Indian Institute of Management Ahmedabad',
      slug: 'iim-ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      established: 1961,
      about: 'IIM Ahmedabad is one of the most prestigious business schools in India and Asia. Known for its case-based pedagogy and strong alumni network, it has produced many business leaders and entrepreneurs.',
      feesMin: 2300000,
      feesMax: 2500000,
      overallRating: 4.9,
      examAccepted: ['CAT', 'GMAT'],
      accreditations: ['AICTE', 'AACSB', 'AMBA', 'EQUIS'],
      campusSize: '102 acres',
      website: 'https://www.iima.ac.in',
      placementAvg: 2500000,
      placementHighest: 70000000,
      topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Goldman Sachs', 'HUL'],
      courses: [
        { name: 'PGP (MBA)', duration: '2 years', annualFees: 2400000, eligibility: 'CAT', field: 'Management' },
        { name: 'PGP-FABM', duration: '2 years', annualFees: 2400000, eligibility: 'CAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Vikram Mehta', rating: 5, content: 'Life-changing experience. The case study method is intense but rewarding.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Indian Institute of Management Bangalore',
      slug: 'iim-bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      established: 1973,
      about: 'IIM Bangalore is a premier management institute located in India\'s silicon city. Known for its strong focus on entrepreneurship and analytics, it has consistently been ranked among the top business schools in India.',
      feesMin: 2300000,
      feesMax: 2500000,
      overallRating: 4.8,
      examAccepted: ['CAT', 'GMAT'],
      accreditations: ['AICTE', 'AACSB', 'AMBA', 'EQUIS'],
      campusSize: '100 acres',
      website: 'https://www.iimb.ac.in',
      placementAvg: 2400000,
      placementHighest: 65000000,
      topRecruiters: ['McKinsey', 'BCG', 'Amazon', 'Flipkart', 'Microsoft'],
      courses: [
        { name: 'PGP (MBA)', duration: '2 years', annualFees: 2350000, eligibility: 'CAT', field: 'Management' },
        { name: 'PGPEM', duration: '2 years', annualFees: 2350000, eligibility: 'CAT/GMAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Ananya Reddy', rating: 5, content: 'Great exposure to startups and tech companies. Bangalore location helps.', yearOfPassing: 2022 },
      ]
    },
    // AIIMS - Top tier medical
    {
      name: 'All India Institute of Medical Sciences Delhi',
      slug: 'aiims-delhi',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1956,
      about: 'AIIMS Delhi is India\'s top medical institution and a hospital of national importance. It offers undergraduate and postgraduate medical education and is known for its excellent research and patient care.',
      feesMin: 10000,
      feesMax: 30000,
      overallRating: 4.9,
      examAccepted: ['NEET', 'INICET'],
      accreditations: ['MCI', 'NAAC A++'],
      campusSize: '132 acres',
      website: 'https://www.aiims.edu',
      placementAvg: 1500000,
      placementHighest: 25000000,
      topRecruiters: ['AIIMS Hospitals', 'Apollo', 'Fortis', 'Max Healthcare'],
      courses: [
        { name: 'MBBS', duration: '5.5 years', annualFees: 15000, eligibility: 'NEET', field: 'Medical' },
        { name: 'MD General Medicine', duration: '3 years', annualFees: 25000, eligibility: 'INICET', field: 'Medical' },
      ],
      reviews: [
        { reviewerName: 'Dr. Sameer Gupta', rating: 5, content: 'The best medical college in India. Hard to get in but worth it.', yearOfPassing: 2021 },
      ]
    },
    // State government colleges
    {
      name: 'College of Engineering Pune',
      slug: 'coep-pune',
      city: 'Pune',
      state: 'Maharashtra',
      established: 1854,
      about: 'COEP Pune is one of the oldest engineering colleges in India. It is an autonomous institute affiliated to Savitribai Phule Pune University. Known for its strong alumni network and good placements in Maharashtra.',
      feesMin: 50000,
      feesMax: 100000,
      overallRating: 4.2,
      examAccepted: ['JEE Main', 'MHT CET'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '38 acres',
      website: 'https://www.coep.org.in',
      placementAvg: 800000,
      placementHighest: 12000000,
      topRecruiters: ['TCS', 'Infosys', 'Cummins', 'Bajaj', 'Mahindra'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 60000, eligibility: 'JEE Main/MHT CET', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 60000, eligibility: 'JEE Main/MHT CET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Siddharth J', rating: 4, content: 'Good value for money. Placements in Maharashtra companies are strong.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Jadavpur University',
      slug: 'jadavpur-university',
      city: 'Kolkata',
      state: 'West Bengal',
      established: 1906,
      about: 'Jadavpur University is a public state university located in Kolkata. It is known for its strong engineering and arts programs. The university has a rich history of academic excellence and social consciousness.',
      feesMin: 30000,
      feesMax: 60000,
      overallRating: 4.3,
      examAccepted: ['WBJEE', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '58 acres',
      website: 'https://www.jaduniv.edu.in',
      placementAvg: 900000,
      placementHighest: 15000000,
      topRecruiters: ['TCS', 'Cognizant', 'PwC', 'Deloitte', 'IBM'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 40000, eligibility: 'WBJEE', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 40000, eligibility: 'WBJEE', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Priyanka Das', rating: 4, content: 'Great academics at very affordable fees. The cultural scene is vibrant.', yearOfPassing: 2022 },
      ]
    },
    // Private colleges - Mix of good and average
    {
      name: 'Vellore Institute of Technology',
      slug: 'vit-vellore',
      city: 'Vellore',
      state: 'Tamil Nadu',
      established: 1984,
      about: 'VIT Vellore is a private deemed university known for its engineering programs. It has a large campus with modern infrastructure and strong industry connections. The institute attracts students from all over India.',
      feesMin: 180000,
      feesMax: 300000,
      overallRating: 4.1,
      examAccepted: ['VITEEE', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '372 acres',
      website: 'https://vit.ac.in',
      placementAvg: 1000000,
      placementHighest: 12000000,
      topRecruiters: ['Amazon', 'Microsoft', 'Zoho', 'DE Shaw', 'Oracle'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 220000, eligibility: 'VITEEE', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 195000, eligibility: 'VITEEE', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Arjun N', rating: 4, content: 'Expensive but good placements. Campus facilities are excellent.', yearOfPassing: 2023 },
        { reviewerName: 'Sneha K', rating: 3, content: 'Too commercialized. Academics are good but everything costs extra.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'SRM Institute of Science and Technology',
      slug: 'srm-chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      established: 2002,
      about: 'SRM Chennai is a private deemed university with a strong focus on engineering and technology. It has multiple campuses and is known for its international collaborations and research programs.',
      feesMin: 200000,
      feesMax: 350000,
      overallRating: 3.9,
      examAccepted: ['SRMJEEE', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A+'],
      campusSize: '250 acres',
      website: 'https://www.srmist.edu.in',
      placementAvg: 850000,
      placementHighest: 10000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Zoho'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 250000, eligibility: 'SRMJEEE', field: 'Engineering' },
        { name: 'B.Tech Biotechnology', duration: '4 years', annualFees: 230000, eligibility: 'SRMJEEE', field: 'Science' },
      ],
      reviews: [
        { reviewerName: 'Karthik R', rating: 4, content: 'Good exposure and placements. The international tie-ups help.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Manipal Institute of Technology',
      slug: 'mit-manipal',
      city: 'Manipal',
      state: 'Karnataka',
      established: 1957,
      about: 'MIT Manipal is a private engineering college under Manipal Academy of Higher Education. It is known for its beautiful campus, strong industry connections, and diverse student community from across India and abroad.',
      feesMin: 350000,
      feesMax: 450000,
      overallRating: 4.0,
      examAccepted: ['MET', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A+'],
      campusSize: '188 acres',
      website: 'https://manipal.edu/mit.html',
      placementAvg: 950000,
      placementHighest: 14000000,
      topRecruiters: ['Microsoft', 'Amazon', 'Cisco', 'SAP', 'Oracle'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 380000, eligibility: 'MET', field: 'Engineering' },
        { name: 'B.Tech Mechatronics', duration: '4 years', annualFees: 360000, eligibility: 'MET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rohan P', rating: 4, content: 'Great campus life and diversity. Expensive but worth it for the exposure.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Birla Institute of Technology and Science Pilani',
      slug: 'bits-pilani',
      city: 'Pilani',
      state: 'Rajasthan',
      established: 1964,
      about: 'BITS Pilani is a private deemed university known for its engineering and science programs. It has a unique semester system and strong focus on research and innovation. The institute has campuses in Dubai, Hyderabad, and Goa.',
      feesMin: 400000,
      feesMax: 500000,
      overallRating: 4.6,
      examAccepted: ['BITSAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '990 acres',
      website: 'https://www.bits-pilani.ac.in',
      placementAvg: 1500000,
      placementHighest: 20000000,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Texas Instruments', 'Adobe'],
      courses: [
        { name: 'B.E. Computer Science', duration: '4 years', annualFees: 420000, eligibility: 'BITSAT', field: 'Engineering' },
        { name: 'B.E. Electrical', duration: '4 years', annualFees: 420000, eligibility: 'BITSAT', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Neha S', rating: 5, content: 'The flexible curriculum is amazing. You can design your own degree.', yearOfPassing: 2023 },
      ]
    },
    // More state government colleges
    {
      name: 'Delhi Technological University',
      slug: 'dtu-delhi',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1941,
      about: 'DTU (formerly DCE) is a state university located in Delhi. It is one of the oldest engineering colleges in Delhi and has a strong reputation for producing quality engineers who work in top companies across the world.',
      feesMin: 150000,
      feesMax: 200000,
      overallRating: 4.3,
      examAccepted: ['JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '164 acres',
      website: 'https://www.dtu.ac.in',
      placementAvg: 1100000,
      placementHighest: 18000000,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Maruti Suzuki', 'Hero'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 160000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 160000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Vikram S', rating: 4, content: 'Great college at a reasonable cost. Placements have improved a lot.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'PES University',
      slug: 'pes-university',
      city: 'Bangalore',
      state: 'Karnataka',
      established: 1988,
      about: 'PES University is a private university in Bangalore known for its engineering and management programs. It has strong industry connections and good placement records, especially in the tech sector.',
      feesMin: 250000,
      feesMax: 350000,
      overallRating: 4.0,
      examAccepted: ['PESSAT', 'COMEDK', 'KCET'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '25 acres',
      website: 'https://www.pes.edu',
      placementAvg: 900000,
      placementHighest: 12000000,
      topRecruiters: ['Amazon', 'Microsoft', 'Cisco', 'SAP', 'Intuit'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 280000, eligibility: 'PESSAT', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 260000, eligibility: 'PESSAT', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rahul M', rating: 4, content: 'Good placements in Bangalore. The faculty is industry-experienced.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Symbiosis Institute of Business Management',
      slug: 'sibm-pune',
      city: 'Pune',
      state: 'Maharashtra',
      established: 1978,
      about: 'SIBM Pune is a premier business school under Symbiosis International University. Known for its strong focus on HR and marketing, it has consistently been ranked among the top B-schools in India.',
      feesMin: 2000000,
      feesMax: 2200000,
      overallRating: 4.4,
      examAccepted: ['SNAP', 'CAT', 'GMAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '5 acres',
      website: 'https://www.sibm.edu',
      placementAvg: 1800000,
      placementHighest: 30000000,
      topRecruiters: ['HUL', 'ITC', 'P&G', 'Asian Paints', 'Marico'],
      courses: [
        { name: 'MBA', duration: '2 years', annualFees: 2100000, eligibility: 'SNAP/CAT', field: 'Management' },
        { name: 'MBA HR', duration: '2 years', annualFees: 2100000, eligibility: 'SNAP/CAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Aditi K', rating: 4, content: 'Great for HR and marketing. The alumni network is strong in FMCG.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Christian Medical College Vellore',
      slug: 'cmc-vellore',
      city: 'Vellore',
      state: 'Tamil Nadu',
      established: 1900,
      about: 'CMC Vellore is one of the top medical colleges in India. It is a private medical college known for its excellent healthcare services and medical education. The college has a strong focus on community health.',
      feesMin: 50000,
      feesMax: 150000,
      overallRating: 4.7,
      examAccepted: ['NEET'],
      accreditations: ['MCI', 'NAAC A++'],
      campusSize: '200 acres',
      website: 'https://www.cmch-vellore.edu.in',
      placementAvg: 1200000,
      placementHighest: 20000000,
      topRecruiters: ['CMC Hospital', 'Apollo', 'Christian Hospital', 'Mission Hospitals'],
      courses: [
        { name: 'MBBS', duration: '5.5 years', annualFees: 80000, eligibility: 'NEET', field: 'Medical' },
        { name: 'B.Sc Nursing', duration: '4 years', annualFees: 60000, eligibility: 'NEET', field: 'Medical' },
      ],
      reviews: [
        { reviewerName: 'Dr. Thomas P', rating: 5, content: 'Excellent medical training with focus on ethics and service.', yearOfPassing: 2020 },
      ]
    },
    {
      name: 'Loyola College Chennai',
      slug: 'loyola-college-chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      established: 1925,
      about: 'Loyola College is a premier arts and science college in Chennai. It is known for its strong academic programs in commerce, science, and arts. The college has a rich tradition of excellence and social commitment.',
      feesMin: 30000,
      feesMax: 80000,
      overallRating: 4.2,
      examAccepted: ['TNEA'],
      accreditations: ['NAAC A++', 'UGC'],
      campusSize: '99 acres',
      website: 'https://www.loyolacollege.edu',
      placementAvg: 500000,
      placementHighest: 8000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Zoho', 'Freshworks'],
      courses: [
        { name: 'B.Com Computer Applications', duration: '3 years', annualFees: 45000, eligibility: 'TNEA', field: 'Commerce' },
        { name: 'B.Sc Computer Science', duration: '3 years', annualFees: 50000, eligibility: 'TNEA', field: 'Science' },
      ],
      reviews: [
        { reviewerName: 'Kavitha R', rating: 4, content: 'Great college at affordable fees. The campus culture is amazing.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'National Institute of Technology Warangal',
      slug: 'nit-warangal',
      city: 'Warangal',
      state: 'Telangana',
      established: 1959,
      about: 'NIT Warangal is one of the premier NITs in India. It is known for its strong engineering programs and research output. The institute has a beautiful campus and excellent infrastructure.',
      feesMin: 80000,
      feesMax: 150000,
      overallRating: 4.3,
      examAccepted: ['JEE Main', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A+'],
      campusSize: '256 acres',
      website: 'https://www.nitw.ac.in',
      placementAvg: 1050000,
      placementHighest: 16000000,
      topRecruiters: ['Microsoft', 'Amazon', 'Oracle', 'Texas Instruments', 'Qualcomm'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 85000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 85000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Srinivas K', rating: 4, content: 'Strong academics and good placements. Core companies visit campus.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Anna University Chennai',
      slug: 'anna-university',
      city: 'Chennai',
      state: 'Tamil Nadu',
      established: 1978,
      about: 'Anna University is a state university in Chennai that oversees engineering colleges in Tamil Nadu. The main campus offers quality engineering education at affordable fees and has strong industry connections.',
      feesMin: 40000,
      feesMax: 80000,
      overallRating: 4.1,
      examAccepted: ['TNEA'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '185 acres',
      website: 'https://www.annauniv.edu',
      placementAvg: 750000,
      placementHighest: 12000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'L&T'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 50000, eligibility: 'TNEA', field: 'Engineering' },
        { name: 'B.Tech Civil', duration: '4 years', annualFees: 45000, eligibility: 'TNEA', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Mohan R', rating: 4, content: 'Great value for money. Government college with good reputation.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Indian Institute of Technology Kharagpur',
      slug: 'iit-kharagpur',
      city: 'Kharagpur',
      state: 'West Bengal',
      established: 1951,
      about: 'IIT Kharagpur is the oldest IIT in India and is known for its large campus and diverse academic programs. The institute has strong research programs and excellent infrastructure across all departments.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.6,
      examAccepted: ['JEE Advanced', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '2100 acres',
      website: 'https://www.iitkgp.ac.in',
      placementAvg: 1500000,
      placementHighest: 25000000,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'Texas Instruments'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Abhishek D', rating: 4, content: 'Huge campus with everything you need. Academics are rigorous.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Indian Institute of Technology Kanpur',
      slug: 'iit-kanpur',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      established: 1959,
      about: 'IIT Kanpur is known for its strong focus on research and innovation. The institute has excellent laboratories and research facilities. It has produced many notable scientists and entrepreneurs.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.6,
      examAccepted: ['JEE Advanced', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '1055 acres',
      website: 'https://www.iitk.ac.in',
      placementAvg: 1550000,
      placementHighest: 28000000,
      topRecruiters: ['Google', 'Microsoft', 'Facebook', 'Adobe', 'Qualcomm'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 125000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Aerospace', duration: '4 years', annualFees: 125000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Nikhil S', rating: 5, content: 'Research opportunities are amazing. Faculty is world-class.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Indian Institute of Technology Roorkee',
      slug: 'iit-roorkee',
      city: 'Roorkee',
      state: 'Uttarakhand',
      established: 1847,
      about: 'IIT Roorkee is the oldest engineering institution in India, originally established as Thomason College of Civil Engineering. It has a rich heritage and strong programs in civil engineering and architecture.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.5,
      examAccepted: ['JEE Advanced', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '365 acres',
      website: 'https://www.iitr.ac.in',
      placementAvg: 1400000,
      placementHighest: 22000000,
      topRecruiters: ['L&T', 'Tata Projects', 'Google', 'Microsoft', 'Amazon'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Civil', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Vikrant S', rating: 4, content: 'Great for civil engineering. The heritage campus is beautiful.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Indian Institute of Technology Guwahati',
      slug: 'iit-guwahati',
      city: 'Guwahati',
      state: 'Assam',
      established: 1994,
      about: 'IIT Guwahati is one of the newer IITs but has quickly established itself as a premier institute. It is known for its beautiful campus on the Brahmaputra river and strong programs in computer science and engineering.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.4,
      examAccepted: ['JEE Advanced', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '700 acres',
      website: 'https://www.iitg.ac.in',
      placementAvg: 1300000,
      placementHighest: 20000000,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Oil India', 'ONGC'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 115000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 115000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rajesh B', rating: 4, content: 'Beautiful campus and peaceful environment. Good placements.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Indian Institute of Technology Hyderabad',
      slug: 'iit-hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      established: 2008,
      about: 'IIT Hyderabad is one of the newer IITs but has quickly gained reputation for its strong focus on research and innovation. The institute has modern infrastructure and strong industry connections in Hyderabad\'s tech hub.',
      feesMin: 100000,
      feesMax: 250000,
      overallRating: 4.3,
      examAccepted: ['JEE Advanced', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '575 acres',
      website: 'https://www.iith.ac.in',
      placementAvg: 1350000,
      placementHighest: 20000000,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Qualcomm', 'Apple'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
        { name: 'B.Tech Electrical', duration: '4 years', annualFees: 120000, eligibility: 'JEE Advanced', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Sandeep K', rating: 4, content: 'New campus with great facilities. Hyderabad location is a plus.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Indian Institute of Management Calcutta',
      slug: 'iim-calcutta',
      city: 'Kolkata',
      state: 'West Bengal',
      established: 1961,
      about: 'IIM Calcutta is the first IIT established in India and is known for its strong focus on finance and analytics. The institute has produced many business leaders and has a strong alumni network.',
      feesMin: 2300000,
      feesMax: 2500000,
      overallRating: 4.7,
      examAccepted: ['CAT', 'GMAT'],
      accreditations: ['AICTE', 'AACSB', 'AMBA'],
      campusSize: '135 acres',
      website: 'https://www.iimcal.ac.in',
      placementAvg: 2300000,
      placementHighest: 60000000,
      topRecruiters: ['McKinsey', 'BCG', 'Goldman Sachs', 'JP Morgan', 'HUL'],
      courses: [
        { name: 'PGP (MBA)', duration: '2 years', annualFees: 2400000, eligibility: 'CAT', field: 'Management' },
        { name: 'PGDBA', duration: '2 years', annualFees: 2400000, eligibility: 'CAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Rajiv M', rating: 5, content: 'Best for finance. The analytics program is top-notch.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Indian Institute of Management Lucknow',
      slug: 'iim-lucknow',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      established: 1984,
      about: 'IIM Lucknow is known for its strong programs in marketing, HR, and operations. The institute has a beautiful campus and good industry connections. It has consistently been ranked among the top B-schools in India.',
      feesMin: 2000000,
      feesMax: 2200000,
      overallRating: 4.5,
      examAccepted: ['CAT', 'GMAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '200 acres',
      website: 'https://www.iiml.ac.in',
      placementAvg: 2000000,
      placementHighest: 45000000,
      topRecruiters: ['HUL', 'ITC', 'P&G', 'Asian Paints', 'Marico'],
      courses: [
        { name: 'PGP (MBA)', duration: '2 years', annualFees: 2100000, eligibility: 'CAT', field: 'Management' },
        { name: 'PGSM', duration: '2 years', annualFees: 2100000, eligibility: 'CAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Priyanka S', rating: 4, content: 'Great for marketing and HR. The campus is peaceful.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Indian Institute of Management Kozhikode',
      slug: 'iim-kozhikode',
      city: 'Kozhikode',
      state: 'Kerala',
      established: 1996,
      about: 'IIM Kozhikode is known for its diverse batch and strong focus on ethics and sustainability. The institute has a beautiful campus on a hilltop and has quickly gained reputation as a top B-school.',
      feesMin: 1900000,
      feesMax: 2100000,
      overallRating: 4.4,
      examAccepted: ['CAT', 'GMAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '112 acres',
      website: 'https://www.iimk.ac.in',
      placementAvg: 1900000,
      placementHighest: 40000000,
      topRecruiters: ['McKinsey', 'BCG', 'Amazon', 'Flipkart', 'HUL'],
      courses: [
        { name: 'PGP (MBA)', duration: '2 years', annualFees: 2000000, eligibility: 'CAT', field: 'Management' },
        { name: 'PGP-FABM', duration: '2 years', annualFees: 2000000, eligibility: 'CAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Arun K', rating: 4, content: 'Great diversity in the batch. The hilltop campus is amazing.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Jawaharlal Nehru University',
      slug: 'jnu-delhi',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1969,
      about: 'JNU is a central university known for its strong programs in social sciences, languages, and sciences. The university has a vibrant campus culture and is known for its academic freedom and research output.',
      feesMin: 10000,
      feesMax: 30000,
      overallRating: 4.3,
      examAccepted: ['JNUEE'],
      accreditations: ['NAAC A++', 'UGC'],
      campusSize: '1019 acres',
      website: 'https://www.jnu.ac.in',
      placementAvg: 600000,
      placementHighest: 10000000,
      topRecruiters: ['UN Organizations', 'Research Institutes', 'Government', 'NGOs'],
      courses: [
        { name: 'M.A. Economics', duration: '2 years', annualFees: 15000, eligibility: 'JNUEE', field: 'Arts' },
        { name: 'M.Sc Computer Science', duration: '2 years', annualFees: 18000, eligibility: 'JNUEE', field: 'Science' },
      ],
      reviews: [
        { reviewerName: 'Meera T', rating: 4, content: 'Great for research and higher studies. Very affordable.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'National Institute of Technology Rourkela',
      slug: 'nit-rourkela',
      city: 'Rourkela',
      state: 'Odisha',
      established: 1961,
      about: 'NIT Rourkela is one of the premier NITs in eastern India. It is known for its strong engineering programs and research output. The institute has good infrastructure and placement records.',
      feesMin: 75000,
      feesMax: 140000,
      overallRating: 4.2,
      examAccepted: ['JEE Main', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '262 acres',
      website: 'https://www.nitrkl.ac.in',
      placementAvg: 950000,
      placementHighest: 14000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'L&T', 'NTPC'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 80000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 80000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Suresh P', rating: 4, content: 'Good college at reasonable fees. Core companies visit campus.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'National Institute of Technology Calicut',
      slug: 'nit-calicut',
      city: 'Kozhikode',
      state: 'Kerala',
      established: 1961,
      about: 'NIT Calicut is one of the premier NITs in southern India. It is known for its strong engineering programs and beautiful campus. The institute has good industry connections and placement records.',
      feesMin: 75000,
      feesMax: 140000,
      overallRating: 4.1,
      examAccepted: ['JEE Main', 'GATE'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '300 acres',
      website: 'https://www.nitc.ac.in',
      placementAvg: 900000,
      placementHighest: 13000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'UST Global'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 80000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 80000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Anil K', rating: 4, content: 'Beautiful campus in Kerala. Good placements in IT companies.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'PSG College of Technology',
      slug: 'psg-coimbatore',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      established: 1951,
      about: 'PSG College of Technology is a premier engineering college in Tamil Nadu. It is known for its strong industry partnerships and practical-oriented education. The college has good infrastructure and placement records.',
      feesMin: 55000,
      feesMax: 100000,
      overallRating: 4.2,
      examAccepted: ['TNEA'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '45 acres',
      website: 'https://www.psgtech.edu',
      placementAvg: 850000,
      placementHighest: 12000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'L&T'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 65000, eligibility: 'TNEA', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 60000, eligibility: 'TNEA', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Karthik M', rating: 4, content: 'Great practical exposure. Industry tie-ups are strong.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Thapar Institute of Engineering and Technology',
      slug: 'thapar-patiala',
      city: 'Patiala',
      state: 'Punjab',
      established: 1956,
      about: 'Thapar Institute is a private deemed university known for its engineering programs. It has good infrastructure and strong industry connections. The institute has been consistently ranked among the top private engineering colleges in India.',
      feesMin: 300000,
      feesMax: 400000,
      overallRating: 4.0,
      examAccepted: ['JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '250 acres',
      website: 'https://www.thapar.edu',
      placementAvg: 950000,
      placementHighest: 14000000,
      topRecruiters: ['Microsoft', 'Amazon', 'Cisco', 'Maruti Suzuki', 'Hero'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 350000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 320000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rohit S', rating: 4, content: 'Good placements and infrastructure. A bit expensive but worth it.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Amrita Vishwa Vidyapeetham',
      slug: 'amrita-coimbatore',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      established: 2003,
      about: 'Amrita Vishwa Vidyapeetham is a private deemed university with multiple campuses across India. The Coimbatore campus is known for its engineering programs and strong focus on research and innovation.',
      feesMin: 250000,
      feesMax: 350000,
      overallRating: 4.1,
      examAccepted: ['AEEE', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '400 acres',
      website: 'https://www.amrita.edu',
      placementAvg: 900000,
      placementHighest: 13000000,
      topRecruiters: ['Amazon', 'Microsoft', 'Cisco', 'SAP', 'Oracle'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 280000, eligibility: 'AEEE', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 260000, eligibility: 'AEEE', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Deepak R', rating: 4, content: 'Good college with strong values. Placements are decent.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'SASTRA University',
      slug: 'sastra-trichy',
      city: 'Tirumalaisamudram',
      state: 'Tamil Nadu',
      established: 1984,
      about: 'SASTRA University is a private deemed university known for its engineering and science programs. It has good infrastructure and strong industry connections. The university has been consistently ranked among the top private universities in India.',
      feesMin: 200000,
      feesMax: 300000,
      overallRating: 4.0,
      examAccepted: ['JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '180 acres',
      website: 'https://www.sastra.edu',
      placementAvg: 850000,
      placementHighest: 12000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Zoho'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 220000, eligibility: 'JEE Main', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 210000, eligibility: 'JEE Main', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Venkat S', rating: 4, content: 'Good academics and placements. Reasonable fees for a private college.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'VJTI Mumbai',
      slug: 'vjti-mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      established: 1887,
      about: 'VJTI is one of the oldest engineering colleges in Mumbai. It is a government-aided institute known for its strong engineering programs and good placement records. The college has a rich heritage and strong alumni network.',
      feesMin: 60000,
      feesMax: 120000,
      overallRating: 4.1,
      examAccepted: ['MHT CET', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '16 acres',
      website: 'https://www.vjti.org.in',
      placementAvg: 800000,
      placementHighest: 12000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'L&T', 'Godrej'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 70000, eligibility: 'MHT CET', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 65000, eligibility: 'MHT CET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Amit B', rating: 4, content: 'Great college at affordable fees. Mumbai location helps with placements.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Institute of Chemical Technology Mumbai',
      slug: 'ict-mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      established: 1933,
      about: 'ICT Mumbai is a premier institute for chemical engineering and technology. It is known for its strong research output and industry connections in the chemical and pharmaceutical sectors.',
      feesMin: 70000,
      feesMax: 130000,
      overallRating: 4.3,
      examAccepted: ['MHT CET', 'JEE Main'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '16 acres',
      website: 'https://www.ictmumbai.edu.in',
      placementAvg: 950000,
      placementHighest: 15000000,
      topRecruiters: ['Reliance', 'Tata Chemicals', 'BASF', 'Dow', 'Pfizer'],
      courses: [
        { name: 'B.Tech Chemical Engineering', duration: '4 years', annualFees: 80000, eligibility: 'MHT CET', field: 'Engineering' },
        { name: 'B.Tech Pharmaceutical', duration: '4 years', annualFees: 85000, eligibility: 'MHT CET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Neha K', rating: 4, content: 'Best for chemical engineering. Great placements in pharma and chemical companies.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'University College of Engineering Osmania',
      slug: 'uce-osmania',
      city: 'Hyderabad',
      state: 'Telangana',
      established: 1929,
      about: 'UCE Osmania is one of the oldest engineering colleges in Telangana. It is a government college known for its strong engineering programs and affordable fees. The college has good infrastructure and placement records.',
      feesMin: 40000,
      feesMax: 80000,
      overallRating: 3.9,
      examAccepted: ['TS EAMCET'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '50 acres',
      website: 'https://www.osmania.ac.in',
      placementAvg: 700000,
      placementHighest: 10000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 50000, eligibility: 'TS EAMCET', field: 'Engineering' },
        { name: 'B.Tech Civil', duration: '4 years', annualFees: 45000, eligibility: 'TS EAMCET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Ramesh T', rating: 4, content: 'Great value for money. Government college with good reputation.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'Bangalore Institute of Management Studies',
      slug: 'bims-bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      established: 1999,
      about: 'BIMS Bangalore is a private management college known for its MBA program. It has good industry connections and placement records. The college focuses on practical learning and industry exposure.',
      feesMin: 800000,
      feesMax: 1000000,
      overallRating: 3.6,
      examAccepted: ['CAT', 'MAT', 'KMAT'],
      accreditations: ['AICTE', 'NBA', 'NAAC B'],
      campusSize: '5 acres',
      website: 'https://www.bims.edu',
      placementAvg: 700000,
      placementHighest: 15000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'HDFC Bank', 'ICICI Bank'],
      courses: [
        { name: 'MBA', duration: '2 years', annualFees: 900000, eligibility: 'CAT/MAT', field: 'Management' },
        { name: 'MBA Finance', duration: '2 years', annualFees: 900000, eligibility: 'CAT/MAT', field: 'Management' },
      ],
      reviews: [
        { reviewerName: 'Pooja R', rating: 3, content: 'Decent college but not top tier. Placements are average.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'Sri Venkateswara College of Engineering',
      slug: 'svce-chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      established: 1985,
      about: 'SVCE Chennai is a private engineering college known for its mechanical and civil engineering programs. It has good infrastructure and decent placement records. The college focuses on practical learning.',
      feesMin: 150000,
      feesMax: 200000,
      overallRating: 3.7,
      examAccepted: ['TNEA'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '50 acres',
      website: 'https://www.svce.ac.in',
      placementAvg: 650000,
      placementHighest: 9000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'L&T'],
      courses: [
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 170000, eligibility: 'TNEA', field: 'Engineering' },
        { name: 'B.Tech Civil', duration: '4 years', annualFees: 160000, eligibility: 'TNEA', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Kumar S', rating: 3, content: 'Average college. Good for mechanical but placements could be better.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'M.S. Ramaiah Institute of Technology',
      slug: 'msrit-bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      established: 1962,
      about: 'MSRIT Bangalore is a private engineering college known for its strong engineering programs. It has good infrastructure and industry connections. The college has been consistently ranked among the top private engineering colleges in Karnataka.',
      feesMin: 200000,
      feesMax: 280000,
      overallRating: 3.9,
      examAccepted: ['COMEDK', 'KCET'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '20 acres',
      website: 'https://www.msrit.edu',
      placementAvg: 800000,
      placementHighest: 11000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'SAP'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 240000, eligibility: 'COMEDK/KCET', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 220000, eligibility: 'COMEDK/KCET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Anand P', rating: 4, content: 'Good college with decent placements. Bangalore location helps.', yearOfPassing: 2022 },
      ]
    },
    {
      name: 'R.V. College of Engineering',
      slug: 'rvce-bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      established: 1963,
      about: 'RVCE Bangalore is one of the top private engineering colleges in Karnataka. It is known for its strong engineering programs and excellent placement records. The college has good infrastructure and industry connections.',
      feesMin: 180000,
      feesMax: 250000,
      overallRating: 4.2,
      examAccepted: ['COMEDK', 'KCET'],
      accreditations: ['AICTE', 'NBA', 'NAAC A++'],
      campusSize: '52 acres',
      website: 'https://www.rvce.edu.in',
      placementAvg: 950000,
      placementHighest: 15000000,
      topRecruiters: ['Microsoft', 'Amazon', 'Cisco', 'SAP', 'Oracle'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 220000, eligibility: 'COMEDK/KCET', field: 'Engineering' },
        { name: 'B.Tech Electronics', duration: '4 years', annualFees: 210000, eligibility: 'COMEDK/KCET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Vikram J', rating: 4, content: 'One of the best private colleges in Karnataka. Great placements.', yearOfPassing: 2023 },
      ]
    },
    {
      name: 'B.M.S. College of Engineering',
      slug: 'bms-bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      established: 1946,
      about: 'BMS College of Engineering is one of the oldest private engineering colleges in Karnataka. It is known for its strong engineering programs and good placement records. The college has a rich heritage and strong alumni network.',
      feesMin: 160000,
      feesMax: 230000,
      overallRating: 4.1,
      examAccepted: ['COMEDK', 'KCET'],
      accreditations: ['AICTE', 'NBA', 'NAAC A'],
      campusSize: '15 acres',
      website: 'https://www.bmsce.ac.in',
      placementAvg: 900000,
      placementHighest: 13000000,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'SAP'],
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 years', annualFees: 200000, eligibility: 'COMEDK/KCET', field: 'Engineering' },
        { name: 'B.Tech Mechanical', duration: '4 years', annualFees: 190000, eligibility: 'COMEDK/KCET', field: 'Engineering' },
      ],
      reviews: [
        { reviewerName: 'Rajesh M', rating: 4, content: 'Old and reputed college. Good placements in IT companies.', yearOfPassing: 2022 },
      ]
    },
  ]

  // Insert colleges with their courses and reviews
  for (const collegeData of colleges) {
    const { courses, reviews, ...collegeInfo } = collegeData

    const college = await prisma.college.create({
      data: collegeInfo,
    })

    // Insert courses
    for (const courseData of courses) {
      await prisma.course.create({
        data: {
          ...courseData,
          collegeId: college.id,
        },
      })
    }

    // Insert reviews
    for (const reviewData of reviews) {
      await prisma.review.create({
        data: {
          ...reviewData,
          collegeId: college.id,
        },
      })
    }
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
