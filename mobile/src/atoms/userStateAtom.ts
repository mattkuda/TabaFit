import { atom } from 'recoil';
import { User } from '../types/users';

interface UserState {
    isAuthenticated: boolean;
    user: User | null;
}

export const userState = atom<UserState>({
    key: 'userState',
    default: {
        isAuthenticated: false,
        user: null,
    },
});
