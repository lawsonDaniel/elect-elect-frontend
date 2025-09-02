'use client';
import { useState } from 'react';
import SideNav from '@/app/component/sideNav';
import DashHeader from '@/app/component/dashHeader';
import { Poppins, Space_Grotesk } from "next/font/google";
import { Download, Upload, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',            
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
});

const mockMaterials = [
  {
    id: 1,
    courseTitle: "EEE 301 - Power Systems Analysis",
    materialType: "Lecture Notes (PDF)",
    description: "Week 4 lecture note on feedback control",
    downloads: 15,
    uploadDate: "2024-01-15",
    uploadedBy: "Dr. Smith"
  },
  {
    id: 2,
    courseTitle: "EEE 301 - Power Systems Analysis", 
    materialType: "Lecture Notes (PDF)",
    description: "Week 4 lecture note on feedback control",
    downloads: 15,
    uploadDate: "2024-01-20",
    uploadedBy: "Dr. Johnson"
  },
  {
    id: 3,
    courseTitle: "EEE 301 - Power Systems Analysis",
    materialType: "Lecture Notes (PDF)", 
    description: "Week 4 lecture note on feedback control",
    downloads: 15,
    uploadDate: "2024-01-25",
    uploadedBy: "Prof. Williams"
  },
  {
    id: 4,
    courseTitle: "EEE 101",
    materialType: "Past Questions (PDF)",
    description: "2019 - 2023 Compilation",
    downloads: 45,
    uploadDate: "2024-02-01",
    uploadedBy: "Dr. Brown"
  },
  {
    id: 5,
    courseTitle: "MTH 111",
    materialType: "Handout (DOCX)",
    description: "Fourier Series Explained",
    downloads: 28,
    uploadDate: "2024-02-05",
    uploadedBy: "Prof. Davis"
  },
  {
    id: 6,
    courseTitle: "PHY 222",
    materialType: "Textbook (PDF)",
    description: "Electricity & Magnetism",
    downloads: 62,
    uploadDate: "2024-02-10",
    uploadedBy: "Dr. Wilson"
  }
];

export default function Page() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('All Resources');
  const [materials, setMaterials] = useState(mockMaterials);
  const [showUploadModal, setShowUploadModal] = useState(false);
  interface UploadForm {
    courseTitle: string;
    materialType: string;
    description: string;
    file: File | null;
  }

  const [uploadForm, setUploadForm] = useState<UploadForm>({
    courseTitle: '',
    materialType: '',
    description: '',
    file: null
  });
  // Mock user role - you would get this from your auth system
  const [userRole, setUserRole] = useState('lecturer'); // 'student' or 'lecturer'
  const { darkMode } = useDarkMode();

  const levels = ['All Resources', '100', '200', '300', '400', '500'];
  const materialTypes = ['Lecture Notes (PDF)', 'Past Questions (PDF)', 'Handout (DOCX)', 'Textbook (PDF)', 'Assignment (PDF)'];

  const handleDownload = (materialId:string) => {
    // Implement download functionality
    console.log(`Downloading material ${materialId}`);
  };

  const handleView = (materialId:number) => {
    // Implement view functionality
    console.log(`Viewing material ${materialId}`);
  };

  const handleEdit = (materialId:number) => {
    // Implement edit functionality
    console.log(`Editing material ${materialId}`);
  };

  const handleDelete = (materialId:number) => {
    setMaterials(materials.filter(material => material.id !== materialId));
  };

  const handleUpload = () => {
    // Implement upload functionality
    if (!uploadForm.courseTitle || !uploadForm.materialType || !uploadForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newMaterial = {
      id: materials.length + 1,
      courseTitle: uploadForm.courseTitle,
      materialType: uploadForm.materialType,
      description: uploadForm.description,
      downloads: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: "Current User"
    };
    
    setMaterials([...materials, newMaterial]);
    setShowUploadModal(false);
    setUploadForm({
      courseTitle: '',
      materialType: '',
      description: '',
      file: null
    });
  };

  const filteredMaterials = selectedLevel === 'All Resources' 
    ? materials 
    : materials.filter(material => 
        material.courseTitle.includes(selectedLevel) || 
        material.courseTitle.toLowerCase().includes(selectedLevel.toLowerCase())
      );

  return (
       <>
        {/* Page Content Area */}
        <div className={`w-full ${poppins.className}`}>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className={`text-xl sm:text-2xl font-semibold ${spaceGrotesk.className} mb-2 ${
                darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
              }`}>
                {userRole === 'lecturer' ? 'My Course Library' : 'Access & Share Knowledge Seamlessly'}
              </h1>
              <p className={`text-sm sm:text-base ${
                darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'
              }`}>
                {userRole === 'lecturer' 
                  ? 'Upload, organize, and manage your course materials.'
                  : 'Browse, download, or upload course materials organized by level and course. Stay ahead with handouts, textbooks, past questions, and more.'
                }
              </p>
            </div>
            
            {userRole === 'lecturer' && (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="mt-4 sm:mt-0 bg-navBlue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Upload Material
              </button>
            )}
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
              }`}>Browse Materials by Level</label>
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className={`border rounded-lg px-3 py-2 min-w-[200px] text-sm ${
                  darkMode 
                    ? 'bg-[#070E12] border-[#101E27] text-[#EDF3F8]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="bg-navBlue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Generate Materials
              </button>
            </div>
          </div>

          {/* Materials Table */}
          <div className={`rounded-lg shadow-sm border overflow-hidden ${
            darkMode 
              ? 'bg-[#070E12] border-[#101E27]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${
                  darkMode 
                    ? 'bg-[#101E27] border-[#101E27]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <tr>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                    }`}>Course Title</th>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                    }`}>Material Type</th>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                    }`}>Description</th>
                    {userRole === 'lecturer' && (
                      <th className={`text-left py-3 px-4 font-medium text-sm ${
                        darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                      }`}>Downloads</th>
                    )}
                    <th className={`text-left py-3 px-4 font-medium text-sm ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                    }`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material:any, index:number) => (
                    <tr key={material.id} className={`border-b ${
                      darkMode 
                        ? `border-[#101E27] ${index % 2 === 0 ? 'bg-[#070E12]' : 'bg-[#0A1117]'}` 
                        : `border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`
                    }`}>
                      <td className={`py-3 px-4 text-sm ${
                        darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                      }`}>{material.courseTitle}</td>
                      <td className={`py-3 px-4 text-sm ${
                        darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                      }`}>{material.materialType}</td>
                      <td className={`py-3 px-4 text-sm ${
                        darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                      }`}>{material.description}</td>
                      {userRole === 'lecturer' && (
                        <td className={`py-3 px-4 text-sm ${
                          darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                        }`}>{material.downloads}</td>
                      )}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {userRole === 'student' ? (
                            <button 
                              onClick={() => handleDownload(material?.id)}
                              className="bg-navBlue text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleView(material.id)}
                                className={`p-1 transition-colors ${
                                  darkMode 
                                    ? 'text-[#EDF3F8] hover:text-[#FFFFFF]' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEdit(material.id)}
                                className={`p-1 transition-colors ${
                                  darkMode 
                                    ? 'text-[#EDF3F8] hover:text-blue-400' 
                                    : 'text-gray-500 hover:text-blue-600'
                                }`}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(material.id)}
                                className={`p-1 transition-colors ${
                                  darkMode 
                                    ? 'text-[#EDF3F8] hover:text-red-400' 
                                    : 'text-gray-500 hover:text-red-600'
                                }`}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Toggle for Demo */}
          <div className={`mt-6 p-4 rounded-lg ${
            darkMode ? 'bg-[#101E27]' : 'bg-blue-50'
          }`}>
            <h3 className={`font-medium mb-2 text-sm ${
              darkMode ? 'text-[#FFFFFF]' : 'text-blue-900'
            }`}>Demo: Toggle User Role</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setUserRole('student')}
                className={`px-3 py-1 rounded text-sm ${
                  userRole === 'student' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'bg-[#070E12] text-[#EDF3F8] border border-[#101E27]' 
                      : 'bg-white text-blue-600'
                }`}
              >
                Student View
              </button>
              <button 
                onClick={() => setUserRole('lecturer')}
                className={`px-3 py-1 rounded text-sm ${
                  userRole === 'lecturer' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'bg-[#070E12] text-[#EDF3F8] border border-[#101E27]' 
                      : 'bg-white text-blue-600'
                }`}
              >
                Lecturer View
              </button>
            </div>
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4">
              <div className={`rounded-lg p-6 w-full max-w-md ${
                darkMode ? 'bg-[#070E12] border border-[#101E27]' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                }`}>Upload Course Material</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                    }`}>Course Title</label>
                    <input 
                      type="text"
                      value={uploadForm.courseTitle}
                      onChange={(e) => setUploadForm({...uploadForm, courseTitle: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        darkMode 
                          ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8] placeholder-[#6B7280]' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="e.g., EEE 301 - Power Systems"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                    }`}>Material Type</label>
                    <select 
                      value={uploadForm.materialType}
                      onChange={(e) => setUploadForm({...uploadForm, materialType: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        darkMode 
                          ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8]' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select type...</option>
                      {materialTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                    }`}>Description</label>
                    <textarea 
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2 h-20 text-sm ${
                        darkMode 
                          ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8] placeholder-[#6B7280]' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Brief description of the material..."
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                    }`}>File</label>
                    <input 
                      type="file"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        darkMode 
                          ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8]' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={handleUpload}
                      className="flex-1 bg-navBlue text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Upload
                    </button>
                    <button 
                      onClick={() => setShowUploadModal(false)}
                      className={`flex-1 border py-2 rounded-lg transition-colors text-sm ${
                        darkMode 
                          ? 'border-[#101E27] text-[#EDF3F8] hover:bg-[#101E27]' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      
       </> 
       
      
  );
}