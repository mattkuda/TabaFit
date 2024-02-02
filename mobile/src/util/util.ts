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
