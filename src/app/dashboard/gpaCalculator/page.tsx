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
    { id: "c1", code: "EEE 101", title: "Intro to Electronics", creditUnit: 3, grade: "A" },
    { id: "c2", code: "MTH 111", title: "General Mathematics", creditUnit: 4, grade: "A" },
  ],
  "200": [
    { id: "c3", code: "EEE 201", title: "Circuits & Systems", creditUnit: 3, grade: "A" },
    { id: "c4", code: "MTH 211", title: "Advanced Calculus", creditUnit: 4, grade: "A" },
  ],
  "300": [
    { id: "c5", code: "EEE 301", title: "Signals & Systems", creditUnit: 3, grade: "A" },
    { id: "c6", code: "CSC 311", title: "Algorithms", creditUnit: 3, grade: "A" },
  ],
  "400": [
    { id: "c7", code: "EEE 401", title: "Microprocessors", creditUnit: 3, grade: "A" },
  ],
  "500": [
    { id: "c8", code: "EEE 501", title: "Final Year Project", creditUnit: 6, grade: "A" },
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