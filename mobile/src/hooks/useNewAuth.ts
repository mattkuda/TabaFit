import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export const useNewAuth = (): any => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (userFound: any) => {
            console.log('got user: ', userFound);
            if (userFound) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { user };
};
