'use client';
import React from 'react'
import { useState } from 'react';
import { Poppins } from "next/font/google";
import { ChevronDown, X } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

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

type CalculationState = 'idle' | 'calculating' | 'completed';

function page() {
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['100']);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isCourseListOpen, SetIsCourseListOpen] = useState<boolean>(false);
    const [calculationState, setCalculationState] = useState<CalculationState>('idle');
    const [calculationProgress, setCalculationProgress] = useState<number>(0);
    const { darkMode } = useDarkMode();
    const [courses, setCourses] = useState<Course[]>([
      {
        id: '1',
        code: 'EEE 101',
        title: 'Intro to Electronics',
        creditUnit: 3,
        grade: 'A'
      },
      {
        id: '2',
        code: 'MTH 111',
        title: 'General Mathematics',
        creditUnit: 4,
        grade: 'C'
      },
      {
        id: '3',
        code: 'EEE 101',
        title: 'Mechanics',
        creditUnit: 2,
        grade: 'B'
      }
    ]);
  
      const gradeOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
  const levelOptions = ['100', '200', '300', '400', '500'];

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  const removeLevelTag = (level: string) => {
    setSelectedLevels(prev => prev.filter(l => l !== level));
  };

  const handleGradeChange = (courseId: string, newGrade: string) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, grade: newGrade } : course
    ));
  };

  const generateCourses = () => {
    // Placeholder for generate courses functionality
    console.log('Generate courses for levels:', selectedLevels);
  };

  const calculateCGPA = () => {
    setCalculationState('calculating');
    setCalculationProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setCalculationProgress(prev => {
        if (prev >= 75) {
          clearInterval(progressInterval);
          // After reaching 75%, wait a moment then show results
          setTimeout(() => {
            setCalculationState('completed');
          }, 500);
          return 75;
        }
        return prev + 15;
      });
    }, 200);
  };

  const resetCalculator = () => {
    setCalculationState('idle');
    setCalculationProgress(0);
  };

  const exportAsPDF = () => {
    console.log('Exporting as PDF...');
  };
  
  return (
    <>
       
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
        }`}>
          Calculate & Track Your CGPA Instantly
        </h1>
        <p className={`text-sm leading-relaxed ${
          darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'
        }`}>
          Select your level, input your grades, and get a real-time view of your academic performance. Make informed 
          decisions, track progress, and stay on top of your goals.
        </p>
      </div>

      {/* Level Selection */}
      <div className="mb-6">
        <div className="flexitems-center gap-4">
          <label className={`text-sm font-medium ${
            darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
          }`}>
            Select Level to Begin Calculation
          </label>
          <div className="flex items-center gap-2">
            
            
            {/* Multi-select dropdown */}
            <div className="relative">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`min-w-[200px] px-3 py-2 border rounded cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#070E12] border-[#101E27] text-[#EDF3F8]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <div className="flex flex-wrap gap-1">
                  {selectedLevels.length === 0 ? (
                    <span className={`text-sm ${
                      darkMode ? 'text-[#6B7280]' : 'text-gray-500'
                    }`}>Select levels...</span>
                  ) : (
                    selectedLevels.map(level => (
                      <span
                        key={level}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {level}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLevelTag(level);
                          }}
                        />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-400'
                } ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown options */}
              {isDropdownOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-10 ${
                  darkMode 
                    ? 'bg-[#070E12] border-[#101E27]' 
                    : 'bg-white border-gray-300'
                }`}>
                  {levelOptions.map(level => (
                    <div
                      key={level}
                      onClick={() => handleLevelToggle(level)}
                      className={`px-3 py-2 cursor-pointer text-sm flex items-center justify-between ${
                        selectedLevels.includes(level) 
                          ? 'bg-blue-50 text-blue-700' 
                          : darkMode 
                            ? 'text-[#EDF3F8] hover:bg-[#101E27]' 
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{level}</span>
                      {selectedLevels.includes(level) && (
                        <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                          <div className="w-2 h-1 bg-white rounded-sm"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={generateCourses}
              className="px-4 py-2 bg-navBlue hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Generate Courses
            </button>
          </div>
        </div>
      </div>

      {/* Course Table or Calculation States */}
      {calculationState === 'idle' && (
        <div className={`rounded-lg border overflow-hidden mb-6 ${
          darkMode 
            ? 'bg-[#070E12] border-[#101E27]' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Table Header */}
          <div className={`grid grid-cols-4 border-b ${
            darkMode 
              ? 'bg-[#101E27] border-[#101E27]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
            }`}>
              Course Code
            </div>
            <div className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
            }`}>
              Course Title
            </div>
            <div className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
            }`}>
              Credit Unit (CU)
            </div>
            <div className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
            }`}>
              Grade
            </div>
          </div>

          {/* Table Body */}
          <div className={`divide-y ${
            darkMode ? 'divide-[#101E27]' : 'divide-gray-200'
          }`}>
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className={`grid grid-cols-4 ${
                  darkMode 
                    ? (index % 2 === 0 ? 'bg-[#070E12]' : 'bg-[#0A1117]')
                    : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                }`}
              >
                <div className={`px-6 py-4 text-sm font-medium ${
                  darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                }`}>
                  {course.code}
                </div>
                <div className={`px-6 py-4 text-sm ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-900'
                }`}>
                  {course.title}
                </div>
                <div className={`px-6 py-4 text-sm text-center ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-900'
                }`}>
                  {course.creditUnit}
                </div>
                <div className="px-6 py-4">
                  <div className="relative">
                    <select
                      value={course.grade}
                      onChange={(e) => handleGradeChange(course.id, e.target.value)}
                      className={`appearance-none border rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-20 ${
                        darkMode 
                          ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8]' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {gradeOptions.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    <div className="absolute inset-0 right-0 flex items-center ml-8 px-2 pointer-events-none">
                      <ChevronDown className={`h-4 w-4 ${
                        darkMode ? 'text-[#EDF3F8]' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculating State */}
      {calculationState === 'calculating' && (
        <div className={`rounded-lg border p-8 mb-6 text-center ${
          darkMode 
            ? 'bg-[#070E12] border-[#101E27]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <div className={`w-16 h-16 rounded-lg mx-auto flex items-center justify-center mb-4 ${
              darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
            }`}>
              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                darkMode ? 'bg-[#070E12]' : 'bg-white'
              }`}>
                <div className="grid grid-cols-2 gap-0.5">
                  <div className={`w-1 h-1 rounded-full ${
                    darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
                  }`}></div>
                  <div className={`w-1 h-1 rounded-full ${
                    darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
                  }`}></div>
                  <div className={`w-1 h-1 rounded-full ${
                    darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
                  }`}></div>
                  <div className={`w-1 h-1 rounded-full ${
                    darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
                  }`}></div>
                </div>
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
            }`}>Calculating CGPA</h3>
            <div className={`w-64 mx-auto rounded-full h-2 mb-2 ${
              darkMode ? 'bg-[#101E27]' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-300 ease-out ${
                  darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
                }`}
                style={{ width: `${calculationProgress}%` }}
              ></div>
            </div>
            <p className={`text-sm ${
              darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'
            }`}>{calculationProgress}% Complete</p>
          </div>
          <button
            onClick={() => {
              setCalculationState('idle');
              setCalculationProgress(0);
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Results State */}
      {calculationState === 'completed' && (
        <div className={`rounded-lg border p-6 mb-6 ${
          darkMode 
            ? 'bg-[#070E12] border-[#101E27]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <p className={`text-sm mb-2 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
            }`}>
              <span className="font-semibold">CGPA for 100-500 Level:</span> 
              <span className={`text-lg font-bold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
              }`}> 3.58 </span>
              <span className={darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}>/ 5.00</span>
            </p>
            <p className={`text-sm ${
              darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
            }`}>
              <span className="font-semibold">Remark:</span> You're doing great! Keep it up. Consider improving 
              your performance in elective courses.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={resetCalculator}
              className={`flex items-center gap-2 px-4 py-2 border rounded text-sm transition-colors ${
                darkMode 
                  ? 'border-[#101E27] text-[#EDF3F8] hover:bg-[#101E27]' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-4 h-4 border border-current rounded-full flex items-center justify-center`}>
                <div className="w-2 h-2 border-l border-b border-current transform rotate-45"></div>
              </div>
              Reset Calculator
            </button>
            <button
              onClick={exportAsPDF}
              className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded transition-colors ${
                darkMode ? 'bg-[#FFFFFF] hover:bg-[#EDF3F8] text-[#070E12]' : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center ${
                darkMode ? 'bg-[#070E12]' : 'bg-white'
              }`}>
                <div className={`w-2 h-2 rounded-sm ${
                  darkMode ? 'bg-[#FFFFFF]' : 'bg-gray-800'
                }`}></div>
              </div>
              Export as PDF
            </button>
          </div>
        </div>
      )}

      {/* Calculate Button - Only show when in idle state */}
      {calculationState === 'idle' && (
        <button
          onClick={calculateCGPA}
          className={`px-6 py-2 text-sm font-medium rounded transition-colors ${
            darkMode 
              ? 'bg-[#FFFFFF] hover:bg-[#EDF3F8] text-[#070E12]' 
              : 'bg-gray-800 hover:bg-gray-900 text-white'
          }`}
        >
          Calculate CGPA
        </button>
      )}

    </>
  )
}

export default page