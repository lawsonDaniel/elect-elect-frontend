'use client';
import React from 'react'
import { useState } from 'react';
import { Poppins } from "next/font/google";
import { ChevronDown, X } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',            
});

interface Course {
  id: string;
  code: string;
  title: string;
  creditUnit: number;
  grade: string;
}

type CalculationState = "idle" | "calculating" | "completed";

const gradeOptions = ["A", "B", "C", "D", "E", "F"];
const levelOptions = ["100", "200", "300", "400", "500"];
const gradePoints: Record<string, number> = {
  A: 5, B: 4, C: 3, D: 2, E: 1, F: 0,
};

// Demo courses by level
const allCourses: Record<string, Course[]> = {
  
  "100": [
    { "id": "c1", "code": "MTH 101", "title": "Elementary Mathematics I (Algebra & Trigonometry)", "creditUnit": 3, "grade": "A" },
    { "id": "c2", "code": "PHY 101", "title": "Mechanics and Properties of Matter", "creditUnit": 3, "grade": "A" },
    { "id": "c3", "code": "PHY 103", "title": "Electromagnetism & Modern Physics", "creditUnit": 3, "grade": "A" },
    { "id": "c4", "code": "PHY 107", "title": "General Physics Practical I", "creditUnit": 2, "grade": "A" },
    { "id": "c5", "code": "CHM 101", "title": "Physical Chemistry I", "creditUnit": 3, "grade": "A" },
    { "id": "c6", "code": "CHM 103", "title": "Practical Physical Chemistry I", "creditUnit": 1, "grade": "A" },
    { "id": "c7", "code": "CS 101", "title": "Introduction to Computer Science", "creditUnit": 2, "grade": "A" },
    { "id": "c8", "code": "GST 103", "title": "Nigerian People and Culture", "creditUnit": 2, "grade": "A" },
    { "id": "c9", "code": "GST 104", "title": "History and Philosophy of Science", "creditUnit": 2, "grade": "A" },
    { "id": "c10", "code": "MTH 102", "title": "Elementary Mathematics II (Vectors, Geometry & Dynamics)", "creditUnit": 3, "grade": "A" },
    { "id": "c11", "code": "MTH 103", "title": "Elementary Mathematics III (Calculus)", "creditUnit": 3, "grade": "A" },
    { "id": "c12", "code": "PHY 102", "title": "Thermal Physics, Sound and Optics", "creditUnit": 3, "grade": "A" },
    { "id": "c13", "code": "PHY 108", "title": "General Physics Practical", "creditUnit": 2, "grade": "A" },
    { "id": "c14", "code": "CHM 102", "title": "Inorganic Chemistry I", "creditUnit": 3, "grade": "A" },
    { "id": "c15", "code": "CHM 106", "title": "Practical Inorganic Chemistry I", "creditUnit": 1, "grade": "A" },
    { "id": "c16", "code": "GST 101", "title": "Use of English", "creditUnit": 4, "grade": "A" },
    { "id": "c17", "code": "GST 102", "title": "Philosophy and Logic", "creditUnit": 2, "grade": "A" },
    { "id": "c18", "code": "CS 102", "title": "Introduction to Computer Applications", "creditUnit": 3, "grade": "A" }
  ],
  "200": [
    { "id": "c19", "code": "CVE 201", "title": "Strength of Materials I", "creditUnit": 2, "grade": "A" },
    { "id": "c20", "code": "MEE 201", "title": "Engineering Mechanics I", "creditUnit": 2, "grade": "A" },
    { "id": "c21", "code": "MEE 203", "title": "Engineering Drawing I", "creditUnit": 2, "grade": "A" },
    { "id": "c22", "code": "MEE 205", "title": "Thermosciences I", "creditUnit": 2, "grade": "A" },
    { "id": "c23", "code": "MEE 207", "title": "Manufacturing Tech./Workshop Practice I", "creditUnit": 1, "grade": "A" },
    { "id": "c24", "code": "EEE 201", "title": "Electrical Circuit Theory", "creditUnit": 2, "grade": "A" },
    { "id": "c25", "code": "EEE 203", "title": "Electronic Measurements and Transducers", "creditUnit": 2, "grade": "A" },
    { "id": "c26", "code": "EEE 211", "title": "Basic Engineering Laboratory I", "creditUnit": 1, "grade": "A" },
    { "id": "c27", "code": "GST 223", "title": "Entrepreneurship Studies", "creditUnit": 2, "grade": "A" },
    { "id": "c28", "code": "MNE 201", "title": "Engineer in Society", "creditUnit": 1, "grade": "A" },
    { "id": "c29", "code": "MTH 201", "title": "Elementary Differential Equation I", "creditUnit": 3, "grade": "A" },
    { "id": "c30", "code": "CVE 202", "title": "Strength of Materials II", "creditUnit": 2, "grade": "A" },
    { "id": "c31", "code": "CVE 204", "title": "Engineering Hydromechanics", "creditUnit": 3, "grade": "A" },
    { "id": "c32", "code": "EEE 202", "title": "Electrical Machines, Power & Installations", "creditUnit": 3, "grade": "A" },
    { "id": "c33", "code": "EEE 212", "title": "Basic Engineering Laboratory II", "creditUnit": 1, "grade": "A" },
    { "id": "c34", "code": "MEE 202", "title": "Engineering Mechanics II", "creditUnit": 2, "grade": "A" },
    { "id": "c35", "code": "MEE 204", "title": "Engineering Drawing II", "creditUnit": 2, "grade": "A" },
    { "id": "c36", "code": "MEE 206", "title": "Thermoscience II", "creditUnit": 2, "grade": "A" },
    { "id": "c37", "code": "MEE 208", "title": "Material Science", "creditUnit": 2, "grade": "A" },
    { "id": "c38", "code": "MEE 210", "title": "Manufacturing Tech./Workshop Practices II", "creditUnit": 1, "grade": "A" },
    { "id": "c39", "code": "MTH 202", "title": "Mathematical Methods I", "creditUnit": 3, "grade": "A" },
    { "id": "c40", "code": "GST 222", "title": "Peace and Conflict Resolution Studies", "creditUnit": 2, "grade": "A" }
  ],
  "300": [
    { "id": "c41", "code": "EEE 301", "title": "Circuit Theory and Systems I", "creditUnit": 3, "grade": "A" },
    { "id": "c42", "code": "EEE 303", "title": "Electromagnetic Fields and Waves", "creditUnit": 2, "grade": "A" },
    { "id": "c43", "code": "EEE 305", "title": "Physical Electronics", "creditUnit": 3, "grade": "A" },
    { "id": "c44", "code": "EEE 307", "title": "Digital Electronics I", "creditUnit": 3, "grade": "A" },
    { "id": "c45", "code": "EEE 309", "title": "Electrical Machines I", "creditUnit": 3, "grade": "A" },
    { "id": "c46", "code": "EEE 311", "title": "Electronics Laboratory", "creditUnit": 1, "grade": "A" },
    { "id": "c47", "code": "EEE 313", "title": "Intro. to Programming for Engineers", "creditUnit": 2, "grade": "A" },
    { "id": "c48", "code": "MTH 341", "title": "Numerical Analysis", "creditUnit": 3, "grade": "A" },
    { "id": "c49", "code": "EEE 302", "title": "Circuit Theory and Systems II", "creditUnit": 2, "grade": "A" },
    { "id": "c50", "code": "EEE 304", "title": "Power Engineering I", "creditUnit": 2, "grade": "A" },
    { "id": "c51", "code": "EEE 306", "title": "Power Electronics I", "creditUnit": 3, "grade": "A" },
    { "id": "c52", "code": "EEE 308", "title": "Measurements and Instrumentation", "creditUnit": 3, "grade": "A" },
    { "id": "c53", "code": "EEE 310", "title": "Electronics Engineering I", "creditUnit": 2, "grade": "A" },
    { "id": "c54", "code": "EEE 312", "title": "Control Engineering I", "creditUnit": 3, "grade": "A" },
    { "id": "c55", "code": "EEE 316", "title": "Computer Programming in C++", "creditUnit": 2, "grade": "A" },
    { "id": "c56", "code": "EEE 318", "title": "Power and Machines Laboratory", "creditUnit": 1, "grade": "A" },
    { "id": "c57", "code": "MTH 342", "title": "Complex Analysis", "creditUnit": 3, "grade": "A" },
    { "id": "c58", "code": "STA 344", "title": "Engineering Statistics", "creditUnit": 3, "grade": "A" },
    { "id": "c59", "code": "MEE 309", "title": "Engineering Fluid Mechanics", "creditUnit": 2, "grade": "A" },
    { "id": "c60", "code": "CVE 411", "title": "Intro. to Transport Engineering", "creditUnit": 2, "grade": "A" },
    { "id": "c61", "code": "CS 244", "title": "Computer Fundamentals & Programming in Java", "creditUnit": 2, "grade": "A" }
  ],
  "400": [
    { "id": "c62", "code": "EEE 401", "title": "Power Engineering II", "creditUnit": 2, "grade": "A" },
    { "id": "c63", "code": "EEE 403", "title": "Telecommunication Principles", "creditUnit": 2, "grade": "A" },
    { "id": "c64", "code": "EEE 405", "title": "Digital Electronics II", "creditUnit": 2, "grade": "A" },
    { "id": "c65", "code": "EEE 407", "title": "Control Engineering II", "creditUnit": 2, "grade": "A" },
    { "id": "c66", "code": "EEE 409", "title": "Electrical Machines II", "creditUnit": 2, "grade": "A" },
    { "id": "c67", "code": "EEE 411", "title": "Laboratory Practical and Mini-Project", "creditUnit": 2, "grade": "A" },
    { "id": "c68", "code": "EEE 413", "title": "Computer Engineering", "creditUnit": 2, "grade": "A" },
    { "id": "c69", "code": "EEE 415", "title": "Analytical Software", "creditUnit": 2, "grade": "A" },
    { "id": "c70", "code": "EEE 417", "title": "Microprocessor and Microcontroller Applications", "creditUnit": 2, "grade": "A" },
    { "id": "c71", "code": "MEE 417", "title": "Law Economics and Management", "creditUnit": 2, "grade": "A" },
    { "id": "c72", "code": "STA 411", "title": "Experimental Design and Quality Control", "creditUnit": 2, "grade": "A" },
    { "id": "c73", "code": "ENG 411", "title": "Engineering Technical Communications", "creditUnit": 1, "grade": "A" },
    { "id": "c74", "code": "EEE 499", "title": "Student Industrial Work Experience Scheme (SIWES)", "creditUnit": 6, "grade": "A" }
  ],
  "500": [
    { "id": "c75", "code": "EEE 501", "title": "Advanced Circuit Theory", "creditUnit": 3, "grade": "A" },
    { "id": "c76", "code": "EEE 503", "title": "Advanced EM Fields and Waves", "creditUnit": 2, "grade": "A" },
    { "id": "c77", "code": "EEE 505", "title": "Energy Systems and Management", "creditUnit": 2, "grade": "A" },
    { "id": "c78", "code": "EEE 507", "title": "Power Systems Protection", "creditUnit": 3, "grade": "A" },
    { "id": "c79", "code": "EEE 509", "title": "Engineering Management and Enterprise", "creditUnit": 2, "grade": "A" },
    { "id": "c80", "code": "EEE 511", "title": "Reliability and Maintainability", "creditUnit": 2, "grade": "A" },
    { "id": "c81", "code": "EEE 513", "title": "Advanced Electrical Machines", "creditUnit": 2, "grade": "A" },
    { "id": "c82", "code": "EEE 520", "title": "Power Engineering III", "creditUnit": 2, "grade": "A" },
    { "id": "c83", "code": "EEE 522", "title": "Power Line Communications", "creditUnit": 2, "grade": "A" },
    { "id": "c84", "code": "EEE 524", "title": "Electric Drives", "creditUnit": 2, "grade": "A" },
    { "id": "c85", "code": "EEE 526", "title": "Electrical Services Design", "creditUnit": 2, "grade": "A" },
    { "id": "c86", "code": "EEE 528", "title": "Power Electronics II", "creditUnit": 2, "grade": "A" },
    { "id": "c87", "code": "EEE 554", "title": "Artificial Neural Networks and Fuzzy Systems", "creditUnit": 2, "grade": "A" },
    { "id": "c88", "code": "EEE 564", "title": "Digital Control Systems", "creditUnit": 2, "grade": "A" },
    { "id": "c89", "code": "EEE 599", "title": "Final Year Project", "creditUnit": 2, "grade": "A" },
    { "id": "c90", "code": "EEE 533", "title": "Telecommunication Networks I", "creditUnit": 3, "grade": "A" },
    { "id": "c91", "code": "EEE 537", "title": "Digital Signal Processing", "creditUnit": 2, "grade": "A" },
    { "id": "c92", "code": "EEE 562", "title": "Web-Based Design and Applications", "creditUnit": 2, "grade": "A" },
    { "id": "c93", "code": "EEE 566", "title": "Embedded Systems", "creditUnit": 2, "grade": "A" },
    { "id": "c94", "code": "EEE 531", "title": "Integrated Circuits and Systems Design", "creditUnit": 2, "grade": "A" },
    { "id": "c95", "code": "EEE 535", "title": "Communication Theory & Systems", "creditUnit": 3, "grade": "A" },
    { "id": "c96", "code": "EEE 532", "title": "Radio Communication", "creditUnit": 2, "grade": "A" },
    { "id": "c97", "code": "EEE 534", "title": "Telecommunications Networks II", "creditUnit": 2, "grade": "A" },
    { "id": "c98", "code": "EEE 536", "title": "Optical Fibre Communication", "creditUnit": 2, "grade": "A" },
    { "id": "c99", "code": "EEE 538", "title": "Satellite Communication", "creditUnit": 2, "grade": "A" },
    { "id": "c100", "code": "EEE 540", "title": "Communications Power Systems", "creditUnit": 2, "grade": "A" },
    { "id": "c101", "code": "EEE 542", "title": "Digital Switching Systems", "creditUnit": 2, "grade": "A" },
    { "id": "c102", "code": "EEE 544", "title": "Advanced Signal Processing", "creditUnit": 2, "grade": "A" },
    { "id": "c103", "code": "EEE 556", "title": "Real-Time Computer Control Systems", "creditUnit": 2, "grade": "A" },
    { "id": "c104", "code": "EEE 558", "title": "Information Warfare and Security", "creditUnit": 2, "grade": "A" },
    { "id": "c105", "code": "EEE 551", "title": "Integrated Circuits and Systems Design", "creditUnit": 3, "grade": "A" },
    { "id": "c106", "code": "EEE 553", "title": "Computer Architecture II", "creditUnit": 2, "grade": "A" },
    { "id": "c107", "code": "EEE 555", "title": "Network Design and Evaluation", "creditUnit": 2, "grade": "A" },
    { "id": "c108", "code": "EEE 552", "title": "Digital Computation", "creditUnit": 2, "grade": "A" },
    { "id": "c109", "code": "EEE 568", "title": "Tele-Traffic Analysis", "creditUnit": 2, "grade": "A" },
    { "id": "c110", "code": "EEE 557", "title": "Computer Aided Digital Design", "creditUnit": 2, "grade": "A" }
  ],
};
function page() {
    const { darkMode } = useDarkMode();
    const [selectedLevels, setSelectedLevels] = useState<string[]>(["100"]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [calculationState, setCalculationState] = useState<CalculationState>("idle");
    const [calculationProgress, setCalculationProgress] = useState(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
    // Toggle level select
    const handleLevelToggle = (level: string) => {
      setSelectedLevels((prev) =>
        prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
      );
    };
  
    const removeLevelTag = (level: string) => {
      setSelectedLevels((prev) => prev.filter((l) => l !== level));
    };
  
    // Generate courses
    const generateCourses = () => {
      let generated: Course[] = [];
      selectedLevels.forEach((lvl) => {
        if (allCourses[lvl]) generated = [...generated, ...allCourses[lvl]];
      });
      setCourses(generated);
      setSelectedCourses([]); // reset selections
    };
  
    // Toggle course selection
    const toggleCourseSelection = (courseId: string) => {
      setSelectedCourses((prev) =>
        prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
      );
    };
  
    // Change grade
    const handleGradeChange = (courseId: string, newGrade: string) => {
      setCourses((prev) =>
        prev.map((course) => (course.id === courseId ? { ...course, grade: newGrade } : course))
      );
    };
  
    // Calculate CGPA
    const calculateCGPA = () => {
      setCalculationState("calculating");
      setCalculationProgress(0);
  
      const interval = setInterval(() => {
        setCalculationProgress((prev) => {
          if (prev >= 75) {
            clearInterval(interval);
            setTimeout(() => setCalculationState("completed"), 500);
            return 75;
          }
          return prev + 15;
        });
      }, 200);
    };
  
    const resetCalculator = () => {
      setCalculationState("idle");
      setCalculationProgress(0);
    };
  
    // Compute GPA for selected courses
    const computeSelectedCGPA = () => {
      const chosen = courses.filter((c) => selectedCourses.includes(c.id));
      if (chosen.length === 0) {
        return { cgpa: "0.00", tcp: 0, tcur: 0 };
      }
  
      let totalPoints = 0; // TCP
      let totalUnits = 0;  // TCUR
  
      chosen.forEach((c) => {
        totalPoints += gradePoints[c.grade] * c.creditUnit; // CCP sum
        totalUnits += c.creditUnit;
      });
  
      const cgpa = (totalPoints / totalUnits).toFixed(2);
      return { cgpa, tcp: totalPoints, tcur: totalUnits };
    };
  
    // ✅ Export as PDF with working autoTable
    const exportAsPDF = () => {
      const { cgpa, tcp, tcur } = computeSelectedCGPA();
      const chosen = courses.filter((c) => selectedCourses.includes(c.id));
  
      const doc = new jsPDF();
  
      // Title
      doc.setFontSize(16);
      doc.text("CGPA Report", 14, 20);
  
      // Summary
      doc.setFontSize(12);
      doc.text(`Total Credit Points (TCP): ${tcp}`, 14, 35);
      doc.text(`Total Credit Units Registered (TCUR): ${tcur}`, 14, 42);
      doc.text(`CGPA: ${cgpa} / 5.00`, 14, 49);
  
      // Course breakdown table
      const tableData = chosen.map((c, i) => [
        i + 1,
        c.code,
        c.title,
        c.creditUnit,
        c.grade,
        gradePoints[c.grade],
        gradePoints[c.grade] * c.creditUnit, // CCP
      ]);
  
      autoTable(doc, {
        head: [["#", "Code", "Title", "Credit Unit", "Grade", "GP", "CCP"]],
        body: tableData,
        startY: 60,
      });
  
      // Footer
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Generated by CGPA Calculator", 14, finalY);
  
      // Save
      doc.save("cgpa_report.pdf");
    };
  
  
  return (
    <>
       
      <div className={`w-full ${poppins.className}`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Calculate & Track Your CGPA Instantly
            </h1>
            <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-600"}`}>
              Select your level, choose courses, input grades, and get a real-time view of your performance.
            </p>
          </div>

          {/* Level Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <label className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Select Level(s)
              </label>

              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`min-w-[200px] px-3 py-2 border rounded cursor-pointer flex items-center justify-between ${
                    darkMode ? "bg-[#070E12] border-[#101E27] text-white" : "bg-white border-gray-300"
                  }`}
                >
                  <div className="flex flex-wrap gap-1">
                    {selectedLevels.length === 0 ? (
                      <span className="text-sm text-gray-500">Select levels...</span>
                    ) : (
                      selectedLevels.map((lvl) => (
                        <span
                          key={lvl}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {lvl}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLevelTag(lvl);
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 ${darkMode ? "text-white" : "text-gray-400"} ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropdownOpen && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-10 ${
                      darkMode ? "bg-[#070E12] border-[#101E27]" : "bg-white border-gray-300"
                    }`}
                  >
                    {levelOptions.map((lvl) => (
                      <div
                        key={lvl}
                        onClick={() => handleLevelToggle(lvl)}
                        className={`px-3 py-2 cursor-pointer text-sm ${
                          selectedLevels.includes(lvl) ? "bg-blue-50 text-blue-700" : ""
                        }`}
                      >
                        {lvl}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={generateCourses}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Generate Courses
              </button>
            </div>
          </div>

          {/* Idle State - Show Table */}
          {calculationState === "idle" && courses.length > 0 && (
            <div className={`rounded-lg border overflow-hidden mb-6 ${darkMode ? "bg-[#070E12]" : "bg-white"}`}>
              <div className="grid grid-cols-5 border-b">
                <div className="px-6 py-3 text-sm font-medium">Select</div>
                <div className="px-6 py-3 text-sm font-medium">Code</div>
                <div className="px-6 py-3 text-sm font-medium">Title</div>
                <div className="px-6 py-3 text-sm font-medium">Credit Unit</div>
                <div className="px-6 py-3 text-sm font-medium">Grade</div>
              </div>

              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-5 border-t text-sm">
                  <div className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => toggleCourseSelection(course.id)}
                    />
                  </div>
                  <div className="px-6 py-4">{course.code}</div>
                  <div className="px-6 py-4">{course.title}</div>
                  <div className="px-6 py-4 text-center">{course.creditUnit}</div>
                  <div className="px-6 py-4">
                    <select
                      value={course.grade}
                      onChange={(e) => handleGradeChange(course.id, e.target.value)}
                      className={`border rounded px-2 py-1 ${darkMode? 'bg-navBlue':'bg-[#fffff]'} `}
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calculate Button */}
          {calculationState === "idle" && courses.length > 0 && (
            <button
              onClick={calculateCGPA}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded"
            >
              Calculate CGPA
            </button>
          )}

          {/* Calculating */}
          {calculationState === "calculating" && (
            <div className="rounded-lg border p-8 mb-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Calculating CGPA</h3>
              <div className="w-64 mx-auto rounded-full h-2 bg-gray-200 mb-2">
                <div
                  className="h-2 rounded-full bg-gray-800 transition-all duration-300"
                  style={{ width: `${calculationProgress}%` }}
                ></div>
              </div>
              <p>{calculationProgress}% Complete</p>
              <button
                onClick={resetCalculator}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Completed */}
          {calculationState === "completed" && (
            <div className="rounded-lg border p-6 mb-6">
              {(() => {
                const { cgpa, tcp, tcur } = computeSelectedCGPA();
                return (
                  <>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Total Credit Points (TCP):</span> {tcp}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Total Credit Units Registered (TCUR):</span> {tcur}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">CGPA:</span>{" "}
                      <span className="text-lg font-bold">{cgpa}</span> / 5.00
                    </p>
                    <p className="text-sm">Remark: Keep pushing, you’re making progress!</p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={resetCalculator}
                        className="px-4 py-2 border rounded text-sm cursor-pointer"
                      >
                        Reset Calculator
                      </button>
                      <button
                        onClick={exportAsPDF}
                        className="px-4 py-2 bg-gray-800 text-white rounded text-sm cursor-pointer hover:bg-gray-950"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

    </>
  )
}

export default page