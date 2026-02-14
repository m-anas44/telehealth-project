export interface Doctor {
  _id: string;
  specialty: string;
  bio: string;
  userId: {
    name: string;
    email: string;
    image?: string;
  };
}

export interface DoctorsResponse {
  profiles: Doctor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}