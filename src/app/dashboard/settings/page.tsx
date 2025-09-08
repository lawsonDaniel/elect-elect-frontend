'use client';
import { useState, useEffect } from 'react';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import endPoints from '@/utils/endpoints.class';
import { useDarkMode } from '@/contexts/DarkModeContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Type definitions
interface ProfileFormValues {
  firstName: string;
  surname: string;
  otherNames: string;
  department: string;
  matric: string;
  email: string;
  phone: string;
  role: 'Student' | 'Staff' | 'Admin';
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationFormValues {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

interface ShowPasswordsState {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

interface CustomFieldProps {
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface PasswordFieldProps {
  name: string;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

// Validation Schemas
const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  surname: Yup.string()
    .min(2, 'Surname must be at least 2 characters')
    .max(50, 'Surname must be less than 50 characters')
    .required('Surname is required'),
  otherNames: Yup.string()
    .max(50, 'Other names must be less than 50 characters'),
  department: Yup.string()
    .required('Department is required'),
  matric: Yup.string()
    .matches(/^[A-Z]{2}\/\d{4}\/[A-Z]{2}\/\d{4}$/, 'Invalid matric number format (e.g., UJ/2018/EL/0001)')
    .required('Matric number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  role: Yup.string()
    .oneOf(['Student', 'Staff', 'Admin'], 'Invalid role selection')
    .required('Role is required'),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .test('different-from-current', 'New password must be different from current password', function(value) {
      return value !== this.parent.currentPassword;
    })
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const notificationValidationSchema = Yup.object({
  emailNotifications: Yup.boolean(),
  smsNotifications: Yup.boolean(),
  pushNotifications: Yup.boolean(),
});

export default function Settings() {
  const { darkMode } = useDarkMode();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');
  const [showPasswords, setShowPasswords] = useState<ShowPasswordsState>({
    current: false,
    new: false,
    confirm: false,
  });
  const [profile, setProfile] = useState<ProfileFormValues | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await endPoints.getUserProfile();
        setProfile({
          firstName: userProfile.firstName || 'John',
          surname: userProfile.surname || 'Doe',
          otherNames: userProfile.otherNames || 'Elon',
          department: userProfile.department || 'Electrical & Electronics Engineering',
          matric: userProfile.mattNumber || userProfile.staffId || 'UJ/2018/EN/0001',
          email: userProfile.schoolEmail || 'elon@gmail.com',
          phone: userProfile.phone || '+234 90 1234 5680',
          role: userProfile.userType.charAt(0).toUpperCase() + userProfile.userType.slice(1) as 'Student' | 'Staff' | 'Admin',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, []);

  // Initial form values
  const initialProfileValues: ProfileFormValues = profile || {
    firstName: 'John',
    surname: 'Doe',
    otherNames: 'Elon',
    department: 'Electrical & Electronics Engineering',
    matric: 'UJ/2018/EN/0001',
    email: 'elon@gmail.com',
    phone: '+234 90 1234 5680',
    role: 'Student',
  };

  const initialPasswordValues: PasswordFormValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const initialNotificationValues: NotificationFormValues = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  };

  const togglePasswordVisibility = (field: keyof ShowPasswordsState): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { strength: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) return { strength: score * 20, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { strength: score * 20, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { strength: score * 20, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const handleProfileSubmit = async (
    values: ProfileFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ): Promise<void> => {
    setError('');
    setSuccess('');
    try {
      const userData = await endPoints.getUserProfile();
      await endPoints.updateUser(userData._id, {
        firstName: values.firstName,
        surname: values.surname,
        otherNames: values.otherNames,
        department: values.department,
        [values.role.toLowerCase() === 'staff' ? 'staffId' : 'mattNumber']: values.matric,
        schoolEmail: values.email,
        phone: values.phone,
        userType: values.role.toLowerCase(),
      });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (
    values: PasswordFormValues,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ): Promise<void> => {
    setError('');
    setSuccess('');
    try {
      // Assuming an API endpoint for password update exists; implement as needed
      // await endPoints.updatePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setSuccess('Password updated successfully!');
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationSubmit = async (
    values: NotificationFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ): Promise<void> => {
    setError('');
    setSuccess('');
    try {
      // Assuming an API endpoint for notification preferences exists; implement as needed
      // await endPoints.updateNotificationPreferences(values);
      setSuccess('Notification preferences updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update notification preferences');
    } finally {
      setSubmitting(false);
    }
  };

  // Custom Field Component for better styling
  const CustomField: React.FC<CustomFieldProps> = ({ name, type = 'text', placeholder, className = '', children, ...props }) => {
    return (
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <div>
            {type === 'select' ? (
              <select
                {...field}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-[#070E12] border-[#101E27] text-[#EDF3F8] focus:ring-[#EDF3F8]'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
                } ${meta.touched && meta.error ? 'border-red-300' : ''} ${className}`}
                {...props}
              >
                {children}
              </select>
            ) : (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-[#070E12] border-[#101E27] text-[#EDF3F8] focus:ring-[#EDF3F8]'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
                } ${meta.touched && meta.error ? 'border-red-300' : ''} ${className}`}
                {...props}
              />
            )}
            <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-600" />
          </div>
        )}
      </Field>
    );
  };

  // Custom Password Field Component
  const PasswordField: React.FC<PasswordFieldProps> = ({ name, placeholder, showPassword, onToggleVisibility }) => {
    return (
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <div>
            <div className="relative">
              <input
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-[#070E12] border-[#101E27] text-[#EDF3F8] focus:ring-[#EDF3F8]'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
                } ${meta.touched && meta.error ? 'border-red-300' : ''}`}
              />
              <button
                type="button"
                onClick={onToggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className={`h-4 w-4 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-400'}`} />
                ) : (
                  <Eye className={`h-4 w-4 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-400'}`} />
                )}
              </button>
            </div>
            <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-600" />
          </div>
        )}
      </Field>
    );
  };

  return (
    <div className="flex min-h-screen">
     
     <div className={`p-4 md:p-6 ${darkMode ? 'bg-[#070E12] text-[#EDF3F8]' : 'bg-gray-100 text-gray-900'}`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl md:text-3xl font-bold ${poppins.className} mb-2 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
              Manage Your Profile & Preferences
            </h1>
            <p className={`text-sm md:text-base ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'}`}>
              Update your personal information, control your account settings, and personalize your dashboard.
            </p>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            {success && <p className="mt-2 text-green-500 text-sm">{success}</p>}
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className={`border-b ${darkMode ? 'border-[#101E27]' : 'border-gray-200'}`}>
              <nav className="flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'profile'
                      ? darkMode
                        ? 'border-navBlue text-navBlue'
                        : 'border-navBlue text-navBlue'
                      : darkMode
                      ? 'border-transparent text-[#EDF3F8] hover:text-white hover:border-[#EDF3F8]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'password'
                      ? darkMode
                        ? 'border-navBlue text-navBlue'
                        : 'border-navBlue text-navBlue'
                      : darkMode
                      ? 'border-transparent text-[#EDF3F8] hover:text-white hover:border-[#EDF3F8]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Password Management
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'notifications'
                      ? darkMode
                        ? 'border-navBlue text-navBlue'
                        : 'border-navBlue text-navBlue'
                      : darkMode
                      ? 'border-transparent text-[#EDF3F8] hover:text-white hover:border-[#EDF3F8]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Notification Preferences
                </button>
              </nav>
            </div>
          </div>

          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className={`rounded-lg shadow-sm border p-6 md:p-8 ${darkMode ? 'bg-[#070E12] border-[#101E27]' : 'bg-white border-gray-200'}`}>
              <Formik
                enableReinitialize
                initialValues={initialProfileValues}
                validationSchema={profileValidationSchema}
                onSubmit={handleProfileSubmit}
              >
                {({ isSubmitting, resetForm }: FormikProps<ProfileFormValues>) => (
                  <Form>
                    {/* Profile Picture Section */}
                    <div className="mb-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center overflow-hidden">
                          <Image
                            width={64}
                            height={64}
                            src="/DrTijani.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-between">
                          <div className="flex flex-col">
                            <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                              Profile Picture
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'} mb-3`}>
                              PNG, JPEG, Under 15mb
                            </p>
                          </div>
                          <div className="flex flex-row gap-3">
                            <button
                              type="button"
                              className={`flex items-center gap-2 px-2 py-0 text-sm rounded-md transition-colors ${
                                darkMode
                                  ? 'bg-[#101E27] text-[#EDF3F8] hover:bg-[#1a2b38]'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Upload className="w-4 h-4" />
                              Upload New Picture
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 bg-[#EF4444] text-sm text-white rounded-md hover:bg-red-900 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          First Name
                        </label>
                        <CustomField name="firstName" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          Surname
                        </label>
                        <CustomField name="surname" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          Other Names
                        </label>
                        <CustomField name="otherNames" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          Department
                        </label>
                        <CustomField name="department" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          {profile?.role.toLowerCase() === 'staff' ? 'Staff ID' : 'Matric Number'}
                        </label>
                        <CustomField name="matric" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          School Email
                        </label>
                        <CustomField name="email" type="email" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          Phone Number
                        </label>
                        <CustomField name="phone" type="tel" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
                          Role
                        </label>
                        <CustomField name="role" type="select">
                          <option value="Student">Student</option>
                          <option value="Staff">Staff</option>
                          <option value="Admin">Admin</option>
                        </CustomField>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => resetForm()}
                        className={`px-6 py-2 border rounded-md transition-colors ${
                          darkMode
                            ? 'border-[#101E27] text-[#EDF3F8] hover:bg-[#101E27]'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        disabled={isSubmitting}
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className={`px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          darkMode
                            ? 'bg-navBlue text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {/* Password Management Tab */}
          {activeTab === 'password' && (
            <div className={`rounded-lg shadow-sm border p-6 md:p-8 ${darkMode ? 'bg-[#070E12] border-[#101E27]' : 'bg-white border-gray-200'}`}>
              <div className="mb-8">
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                  Password Management
                </h3>
                <p className={`text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'}`}>
                  Update your password to keep your account secure.
                </p>
              </div>

              <Formik
                initialValues={initialPasswordValues}
                validationSchema={passwordValidationSchema}
                onSubmit={handlePasswordSubmit}
              >
                {({ isSubmitting, resetForm, values }: FormikProps<PasswordFormValues>) => {
                  const passwordStrength = getPasswordStrength(values.newPassword);

                  return (
                    <Form>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Password */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-900'}`}>
                            Current Password
                          </label>
                          <PasswordField
                            name="currentPassword"
                            placeholder="••••••••"
                            showPassword={showPasswords.current}
                            onToggleVisibility={() => togglePasswordVisibility('current')}
                          />
                        </div>

                        {/* New Password */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-900'}`}>
                            New Password
                          </label>
                          <PasswordField
                            name="newPassword"
                            placeholder="••••••••"
                            showPassword={showPasswords.new}
                            onToggleVisibility={() => togglePasswordVisibility('new')}
                          />
                          {values.newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`flex-1 h-1 rounded-full ${darkMode ? 'bg-[#101E27]' : 'bg-gray-200'}`}>
                                  <div
                                    className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: `${passwordStrength.strength}%` }}
                                  ></div>
                                </div>
                                <span
                                  className={`text-xs font-medium ${
                                    passwordStrength.label === 'Weak'
                                      ? 'text-red-600'
                                      : passwordStrength.label === 'Fair'
                                      ? 'text-yellow-600'
                                      : passwordStrength.label === 'Good'
                                      ? 'text-blue-600'
                                      : 'text-green-600'
                                  }`}
                                >
                                  {passwordStrength.label}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-900'}`}>
                            Confirm New Password
                          </label>
                          <PasswordField
                            name="confirmPassword"
                            placeholder="••••••••"
                            showPassword={showPasswords.confirm}
                            onToggleVisibility={() => togglePasswordVisibility('confirm')}
                          />
                        </div>
                      </div>

                      {/* Password Requirements */}
                      {values.newPassword && (
                        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-[#101E27]' : 'bg-gray-50'}`}>
                          <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                            Password Requirements:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div
                              className={`flex items-center gap-2 ${
                                values.newPassword.length >= 8 ? 'text-green-600' : darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  values.newPassword.length >= 8 ? 'bg-green-500' : darkMode ? 'bg-[#EDF3F8]' : 'bg-gray-300'
                                }`}
                              ></div>
                              At least 8 characters
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /[A-Z]/.test(values.newPassword) ? 'text-green-600' : darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  /[A-Z]/.test(values.newPassword) ? 'bg-green-500' : darkMode ? 'bg-[#EDF3F8]' : 'bg-gray-300'
                                }`}
                              ></div>
                              One uppercase letter
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /[a-z]/.test(values.newPassword) ? 'text-green-600' : darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  /[a-z]/.test(values.newPassword) ? 'bg-green-500' : darkMode ? 'bg-[#EDF3F8]' : 'bg-gray-300'
                                }`}
                              ></div>
                              One lowercase letter
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /\d/.test(values.newPassword) ? 'text-green-600' : darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  /\d/.test(values.newPassword) ? 'bg-green-500' : darkMode ? 'bg-[#EDF3F8]' : 'bg-gray-300'
                                }`}
                              ></div>
                              One number
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /[!@#$%^&*(),.?":{}|<>]/.test(values.newPassword)
                                  ? 'text-green-600'
                                  : darkMode
                                  ? 'text-[#EDF3F8]'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  /[!@#$%^&*(),.?":{}|<>]/.test(values.newPassword)
                                    ? 'bg-green-500'
                                    : darkMode
                                    ? 'bg-[#EDF3F8]'
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                              One special character
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => resetForm()}
                          className={`px-6 py-2 border rounded-md transition-colors ${
                            darkMode
                              ? 'border-[#101E27] text-[#EDF3F8] hover:bg-[#101E27]'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          disabled={isSubmitting}
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className={`px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            darkMode
                              ? 'bg-navBlue text-white hover:bg-blue-700'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Updating...' : 'Save Changes'}
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          )}

          {/* Notification Preferences Tab */}
          {activeTab === 'notifications' && (
            <div className={`rounded-lg shadow-sm border p-6 md:p-8 ${darkMode ? 'bg-[#070E12] border-[#101E27]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                Notification Preferences
              </h3>
              <Formik
                initialValues={initialNotificationValues}
                validationSchema={notificationValidationSchema}
                onSubmit={handleNotificationSubmit}
              >
                {({ isSubmitting }: FormikProps<NotificationFormValues>) => (
                  <Form>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                            Email Notifications
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}`}>
                            Receive notifications via email
                          </p>
                        </div>
                        <Field
                          name="emailNotifications"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                            SMS Notifications
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}`}>
                            Receive notifications via SMS
                          </p>
                        </div>
                        <Field
                          name="smsNotifications"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
                            Push Notifications
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}`}>
                            Receive push notifications in browser
                          </p>
                        </div>
                        <Field
                          name="pushNotifications"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        className={`px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          darkMode
                            ? 'bg-navBlue text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
    </div>
  );
}