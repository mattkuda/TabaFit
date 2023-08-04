export interface User {
    _id: string;
    username: string;
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}
