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
