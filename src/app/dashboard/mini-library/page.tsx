'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Poppins, Space_Grotesk } from "next/font/google";
import { Download, Upload, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import endPoints from '@/utils/endpoints.class';

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

// Validation schema for upload form
const uploadSchema = Yup.object().shape({
  courseTitle: Yup.string().required('Course title is required'),
  courseCode: Yup.string().required('Course code is required'),
  materialType: Yup.string().required('Material type is required'),
  level: Yup.string().required('Level is required'),
  description: Yup.string().required('Description is required'),
  file: Yup.mixed().required('File is required'),
});

export default function Page() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('All Resources');
  const [materials, setMaterials] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('lecturer'); // 'student' or 'lecturer'
  const { darkMode } = useDarkMode();

  const levels = ['All Resources', '100', '200', '300', '400', '500'];
  const materialTypes = ['Lecture Notes (PDF)', 'Past Questions (PDF)', 'Handout (DOCX)', 'Textbook (PDF)', 'Assignment (PDF)'];

  // Formik form for upload
  const formik = useFormik({
    initialValues: {
      courseTitle: '',
      courseCode: '',
      materialType: '',
      level: '',
      description: '',
      file: null,
    },
    validationSchema: uploadSchema,
    onSubmit: async (values: any, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        console.log("Uploading material with values:", values);
        await endPoints.uploadMaterial(values);
        setSuccess('Material uploaded successfully!');
        setShowUploadModal(false);
        resetForm();
        fetchMaterials(); // Refresh the materials list
      } catch (error: any) {
        setError(error.message || 'Failed to upload material');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch materials on component mount or when selectedLevel changes
  useEffect(() => {
    fetchMaterials();
  }, [selectedLevel]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = selectedLevel !== 'All Resources' ? { level: selectedLevel } : {};
      console.log("Fetching materials with params:", params); // Debug log
      const response = await endPoints.getMaterials(params);
      console.log("Fetched materials:", response); // Debug log
      setMaterials(response.data || response);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch materials');
      console.error("Fetch materials error:", error); // Debug log
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (materialId: string) => {
    try {
      await endPoints.downloadMaterial(materialId);
      setSuccess('Download started successfully');
      
      // Update download count in UI
      setMaterials(materials.map((material: any) => 
        material.id === materialId 
          ? { ...material, downloads: material.downloads + 1 } 
          : material
      ));
    } catch (error: any) {
      setError(error.message || 'Failed to download material');
    }
  };

  const handleView = (materialId: string) => {
    console.log(`Viewing material ${materialId}`);
  };

  const handleEdit = (materialId: string) => {
    console.log(`Editing material ${materialId}`);
  };

  const handleDelete = async (materialId: string) => {
    try {
      await endPoints.deleteMaterial(materialId);
      setSuccess('Material deleted successfully');
      setMaterials(materials.filter((material: any) => material.id !== materialId));
    } catch (error: any) {
      setError(error.message || 'Failed to delete material');
    }
  };

  // Rely on backend filtering instead of client-side filtering
  const filteredMaterials = materials;

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <>
      {/* Page Content Area */}
      <div className={`w-full ${poppins.className}`}>
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

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
              onChange={(e) => {
                setSelectedLevel(e.target.value);
              }}
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
{/*           
          <div className="flex items-end">
            <button className="bg-navBlue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Generate Materials
            </button>
          </div> */}
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
                  <th className={`text-left py-3 px-4 font-medium text-sm ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                  }`}>Level</th>
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
                {loading ? (
                  <tr>
                    <td colSpan={userRole === 'lecturer' ? 6 : 5} className="py-4 text-center">
                      Loading materials...
                    </td>
                  </tr>
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={userRole === 'lecturer' ? 6 : 5} className="py-4 text-center">
                      No materials found
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material: any, index: number) => (
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
                      <td className={`py-3 px-4 text-sm ${
                        darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                      }`}>{material.level}</td>
                      {userRole === 'lecturer' && (
                        <td className={`py-3 px-4 text-sm ${
                          darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                        }`}>{material.downloads}</td>
                      )}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {userRole === 'student' ? (
                            <button 
                              onClick={() => handleDownload(material.id)}
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
                  ))
                )}
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
              
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                  }`}>Course Title *</label>
                  <input 
                    type="text"
                    name="courseTitle"
                    value={formik.values.courseTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8] placeholder-[#6B7280]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      formik.touched.courseTitle && formik.errors.courseTitle ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Power Systems Analysis"
                  />
                  {formik.touched.courseTitle && formik.errors.courseTitle && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.courseTitle}</div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                  }`}>Course Code *</label>
                  <input 
                    type="text"
                    name="courseCode"
                    value={formik.values.courseCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8] placeholder-[#6B7280]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      formik.touched.courseCode && formik.errors.courseCode ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., EEE 301"
                  />
                  {formik.touched.courseCode && formik.errors.courseCode && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.courseCode}</div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                  }`}>Level *</label>
                  <select 
                    name="level"
                    value={formik.values.level}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      formik.touched.level && formik.errors.level ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select level...</option>
                    {['100', '200', '300', '400', '500'].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {formik.touched.level && formik.errors.level && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.level}</div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                  }`}>Material Type *</label>
                  <select 
                    name="materialType"
                    value={formik.values.materialType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      formik.touched.materialType && formik.errors.materialType ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select type...</option>
                    {materialTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formik.touched.materialType && formik.errors.materialType && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.materialType}</div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                  }`}>Description *</label>
                  <textarea 
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 h-20 text-sm ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8] placeholder-[#6B7280]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="Brief description of the material..."
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-gray-700'
                  }`}>File *</label>
                  <input 
                    type="file"
                    name="file"
                    onChange={(event) => {
                      formik.setFieldValue('file', event.currentTarget.files?.[0] || null);
                    }}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      formik.touched.file && formik.errors.file ? 'border-red-500' : ''
                    }`}
                    accept=".pdf,.doc,.docx"
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.file}</div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button 
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="flex-1 bg-navBlue text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {formik.isSubmitting ? 'Uploading...' : 'Upload'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      formik.resetForm();
                    }}
                    className={`flex-1 border py-2 rounded-lg transition-colors text-sm ${
                      darkMode 
                        ? 'border-[#101E27] text-[#EDF3F8] hover:bg-[#101E27]' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </> 
  );
}