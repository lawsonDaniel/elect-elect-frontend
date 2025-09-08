import api from "./api";

export enum Gender {
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

interface LOGIN_DATA {
  email: string;
  password: string;
}

interface UPLOAD_MATERIAL_DATA {
  courseTitle: string;
  courseCode: string;
  materialType: string;
  description: string;
  file: File;
  level:string
}

interface UPDATE_MATERIAL_DATA {
  courseTitle?: string;
  courseCode?: string;
  materialType?: string;
  description?: string;
}

interface MATERIALS_QUERY {
  level?: string;
  materialType?: string;
  courseCode?: string;
  uploadedBy?: string;
  page?: number;
  limit?: number;
}

class EndPoints {
  // Auth endpoints
  public staffRegister = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/staff/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Registration failed';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during registration');
      }
    }
  }

  public studentRegister = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/student/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Registration failed';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during registration');
      }
    }
  }

  public login = async (data: LOGIN_DATA) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Login failed';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during login');
      }
    }
  }

  // Materials endpoints
  public getMaterials = async (params?: MATERIALS_QUERY) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.level) queryParams.append('level', params.level);
      if (params?.materialType) queryParams.append('materialType', params.materialType);
      if (params?.courseCode) queryParams.append('courseCode', params.courseCode);
      if (params?.uploadedBy) queryParams.append('uploadedBy', params.uploadedBy);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `/materials${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to fetch materials';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  public uploadMaterial = async (data: UPLOAD_MATERIAL_DATA) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('courseTitle', data.courseTitle);
      formData.append('courseCode', data.courseCode);
      formData.append('materialType', data.materialType);
      formData.append('description', data.description);
      formData.append('level',data.level)
       for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
    const response = await api.post('/materials', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

      console.log("Upload response:", response);
    return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to upload material';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during upload');
      }
    }
  }

  public getMaterial = async (id: string) => {
    try {
      const response = await api.get(`/materials/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to fetch material';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  public updateMaterial = async (id: string, data: UPDATE_MATERIAL_DATA) => {
    try {
      const response = await api.put(`/materials/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to update material';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during update');
      }
    }
  }

  public updateUser = async (id: string, data:any ) => {
    try {
      const response = await api.put(`/auth/user/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to update user';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during update');
      }
    }
  }

  public deleteMaterial = async (id: string) => {
    try {
      const response = await api.delete(`/materials/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to delete material';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during deletion');
      }
    }
  }

  public downloadMaterial = async (id: string) => {
    try {
      const response = await api.get(`/materials/${id}/download`, {
        responseType: 'blob',
      });
      
      // Create blob URL for download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to download material';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred during download');
      }
    }
  }

  public getMaterialsStats = async (userId?: string) => {
    try {
      const url = `/materials/stats${userId ? `?userId=${userId}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || 'Failed to fetch statistics';
        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        throw customError;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }
}

const endPoints = new EndPoints();
export default endPoints;