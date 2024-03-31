import { WorkoutIncludeSettings } from '../types/workouts';

export const formatName = (firstName: string, lastName: string): string => {
    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    }
    if (firstName) {
        return firstName;
    }
    if (lastName) {
        return lastName;
    }
    return '';
};

export const formatTabatasCount = (numberOfTabtats: number): string => {
    if (numberOfTabtats === 1) {
        return '1 Tabata';
    }
    return `${numberOfTabtats} Tabatas`;
};
export const formatBodyParts = (includeSettings: WorkoutIncludeSettings): string => {
    const bodyParts = [];

    if (includeSettings?.includeAbs) {
        bodyParts.push('Abs');
    }
    if (includeSettings?.includeCardio) {
        bodyParts.push('Cardio');
    }
    if (includeSettings?.includeLower) {
        bodyParts.push('Lower');
    }
    if (includeSettings?.includeUpper) {
        bodyParts.push('Upper');
    }
    return bodyParts.join(', ');
};
