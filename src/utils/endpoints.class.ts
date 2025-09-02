import api from "./api";

enum Gender {
  MALE = "Male",
  FEMALE = "Female"
}

interface REGISTER_STAFF_DATA {
  surname: string;
  firstName: string;
  gender: Gender;
  rank: string;
  schoolEmail: string;
  staffId: string;
  password: string;
  repeatPassword: string;
}

class EndPoints {
  public staffRegister = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/staff/register', data);
      return response.data;
    } catch (error: any) {
      // Handle axios error responses
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Registration failed';
        
        // Create a new error with the response data attached
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        // Network error
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred during registration');
      }
    }
  }
  public studentRegister = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/student/register', data);
      return response.data;
    } catch (error: any) {
      // Handle axios error responses
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Registration failed';
        
        // Create a new error with the response data attached
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        // Network error
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred during registration');
      }
    }
  }
  public login = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      // Handle axios error responses
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Login failed';
        
        // Create a new error with the response data attached
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        // Network error
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred during login');
      }
    }
  }
}

const endPoints = new EndPoints();
export default endPoints;