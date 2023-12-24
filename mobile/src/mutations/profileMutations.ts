import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = 'http://localhost:3000';

interface ProfilePictureVariables {
    formData: FormData;
    userId: string;
}
interface UploadResponse {
    url: string;
}

export const useMutateProfilePicture = (): UseMutationResult<UploadResponse, AxiosError, ProfilePictureVariables> => useMutation<UploadResponse, AxiosError, ProfilePictureVariables>(
    ({ formData, userId }) => axios.post<UploadResponse>(`${apiUrl}/users/upload/${userId}`, formData)
        .then((response) => response.data), // Here we ensure we return the data from the axios response
    {
        onError: (error) => {
            console.error('Error updating profile picture', error.message);
        },
    },
);

interface UpdateProfileVariables {
    userId: string;
    userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export const useMutateUpdateProfile = (): UseMutationResult<void, AxiosError, UpdateProfileVariables> => useMutation<void, AxiosError, UpdateProfileVariables>(
    ({ userId, userData }) => axios.put(`${apiUrl}/users/${userId}`, userData),
    {
        onError: (error) => {
            console.error('Error updating profile', error.message);
        },
    },
);
