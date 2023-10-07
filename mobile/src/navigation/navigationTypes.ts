import { User } from '../types/users';

export type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: { user: User };
};
