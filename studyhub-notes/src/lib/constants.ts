export const BRANCHES_WITH_SUBJECTS = {
  "Computer Science": [
    "Operating Systems",
    "Data Structures & Algorithms",
    "Database Management (DBMS)",
    "Computer Networks",
    "Discrete Mathematics",
    "WEB Development",
    "Software Engineering",
    "Artificial Intelligence",
    "Machine Learning",
    "Compiler Design",
    "Theory of Computation"
  ],
  "Mechanical Engineering": [
    "Thermodynamics",
    "Machine Design",
    "Fluid Mechanics",
    "Manufacturing Processes",
    "Heat & Mass Transfer",
    "Dynamics of Machines",
    "Kinematics",
    "Automobile Engineering",
    "Robotics",
    "Power Plant Engineering"
  ],
  "Electrical Engineering": [
    "Circuit Theory",
    "Power Systems",
    "Control Systems",
    "Electrical Machines",
    "Digital Electronics",
    "Electromagnetics",
    "Signal Processing",
    "Renewable Energy Sources",
    "High Voltage Engineering"
  ],
  "Civil Engineering": [
    "Structural Analysis",
    "Geotechnical Engineering",
    "Surveying",
    "Transportation Engineering",
    "Concrete Technology",
    "Construction Planning",
    "Water Resource Engineering",
    "Building Materials"
  ],
  "Electronics & Communication": [
    "Signal Processing",
    "Analog Circuits",
    "Digital Logic Design",
    "Microprocessors & Controller",
    "Antenna & Wave Propagation",
    "Optical Communication",
    "VLSI Design",
    "Embedded Systems"
  ],
  "Information Technology": [
    "Cloud Computing",
    "Information Security",
    "Data Mining",
    "Professional Ethics",
    "Big Data Analytics",
    "Digital Marketing",
    "Cryptography"
  ],
  "Mathematics & Science": [
    "Calculus",
    "Linear Algebra",
    "Physics I",
    "Physics II",
    "Engineering Chemistry",
    "Environmental Science",
    "Probability & Statistics"
  ],
  "Other": ["General", "Humanities", "MBA", "Commerce", "Arts"]
};

export const ALL_BRANCHES = Object.keys(BRANCHES_WITH_SUBJECTS);
export const ALL_SUBJECTS = Array.from(new Set(Object.values(BRANCHES_WITH_SUBJECTS).flat()));
