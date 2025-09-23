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
  level: string
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

interface UPDATE_PASSWORD_DATA {
  currentPassword: string;
  newPassword: string;
}

interface UPDATE_NOTIFICATION_DATA {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}
interface CREATE_NOTIFICATION_DATA {
  userId: string;
  type: 'announcement' | 'event' | 'message' | 'payment' | 'other';
  title: string;
  content: string;
}

interface UPDATE_NOTIFICATION_DATA {
  id: string;
}
class EndPoints {
  public staffRegister = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/staff/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  public studentRegister = async (data: REGISTER_STAFF_DATA) => {
    try {
      const response = await api.post('/auth/student/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  public login = async (data: LOGIN_DATA) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

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
      throw new Error(error.response?.data?.error || 'Failed to fetch materials');
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
      formData.append('level', data.level);
      const response = await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to upload material');
    }
  }

  public getMaterial = async (id: string) => {
    try {
      const response = await api.get(`/materials/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch material');
    }
  }

  public updateMaterial = async (id: string, data: UPDATE_MATERIAL_DATA) => {
    try {
      const response = await api.put(`/materials/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update material');
    }
  }

  public updateUser = async (id: string, data: any) => {
    try {
      const response = await api.put(`/auth/user/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  }

  public updatePassword = async (data: UPDATE_PASSWORD_DATA) => {
    try {
      const response = await api.put('/auth/password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update password');
    }
  }
  public updateNotificationPreferences = async (data: UPDATE_NOTIFICATION_DATA) => {
    try {
      const response = await api.put('/auth/notifications', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update notification preferences');
    }
  }

  public deleteMaterial = async (id: string) => {
    try {
      const response = await api.delete(`/materials/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete material');
    }
  }

  // public downloadMaterial = async (id: string) => {
  //   try {
  //     const response = await api.get(`/materials/${id}/download`, {
  //       responseType: 'blob',
  //     });
  //     const blob = new Blob([response.data]);
  //     const url = window.URL.createObjectURL(blob);
  //     const contentDisposition = response.headers['content-disposition'];
  //     let filename = 'download';
  //     if (contentDisposition) {
  //       const filenameMatch = contentDisposition.match(/filename="(.+)"/);
  //       if (filenameMatch) {
  //         filename = filenameMatch[1];
  //       }
  //     }
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', filename);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //     return { success: true, message: 'Download started' };
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.error || 'Failed to download material');
  //   }
  // }
  public downloadMaterial = async (id: string) => {
  try {
    // This will redirect to S3 URL and increment download count
    window.open(`/api/materials/${id}/download`, '_blank');
    return { success: true, message: 'Download started' };
  } catch (error: any) {
    throw new Error('Failed to download material');
  }
}

  public getMaterialsStats = async (userId?: string) => {
    try {
      const url = `/materials/stats${userId ? `?userId=${userId}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  }

  public getAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch announcements');
    }
  }

  public createAnnouncement = async (data: { title: string; content: string }) => {
    try {
      const response = await api.post('/announcements/create', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create announcement');
    }
  }

  public getCalendarEvents = async () => {
    try {
      const response = await api.get('/calendar');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch calendar events');
    }
  }

  public createCalendarEvent = async (data: { date: string; title: string }) => {
    try {
      const response = await api.post('/calendar/create', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create calendar event');
    }
  }

  public getUserProfile = async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  public getDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
 public getNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }

  public createNotification = async (data: CREATE_NOTIFICATION_DATA) => {
    try {
      const response = await api.post('/notifications', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create notification');
    }
  }

  public markNotificationAsRead = async (data: any) => {
    try {
      const response = await api.put('/notifications', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update notification');
    }
  }

}

const endPoints = new EndPoints();
export default endPoints;