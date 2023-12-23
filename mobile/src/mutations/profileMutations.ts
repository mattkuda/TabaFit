import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = 'http://localhost:3000';

interface ProfilePictureVariables {
    formData: FormData;
    userId: string;
}

export const useMutateProfilePicture = (): UseMutationResult<void, AxiosError, ProfilePictureVariables> => useMutation<void, AxiosError, ProfilePictureVariables>(
    ({ formData, userId }) => axios.post(`${apiUrl}/users/upload/${userId}`, formData), // Adjusted URL to match the server endpoint
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
