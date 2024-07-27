import { Difficulty, WorkoutIncludeSettings } from '../types/workouts';
// @ts-ignore
import lowerBodyIcon from '../../assets/exercise-icons/lower-body.png';
// @ts-ignore
import upperBodyIcon from '../../assets/exercise-icons/upper-body.png';
// @ts-ignore
import absIcon from '../../assets/exercise-icons/abs.png';
// @ts-ignore
import cardioIcon from '../../assets/exercise-icons/cardio.png';
// @ts-ignore
import kettlebell from '../../assets/exercise-icons/kettlebell.png';
// import glutesIcon from '../assets/exercise-icons/glutes.png';
// import spicyIcon from '../assets/exercise-icons/spicy.png';

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
export const exerciseIconDictionary: Record<string, any> = {
    'Lower Body': lowerBodyIcon,
    'Upper Body': upperBodyIcon,
    Abs: absIcon,
    Cardio: cardioIcon,
    Glutes: cardioIcon,
    Spicy: cardioIcon,
};

// TODO: Update this dictionary with the correct icons
// https://www.flaticon.com/free-icon/kettlebell_8915448?term=kettlebell&page=1&position=2&origin=search&related_id=8915448
export const equipmentIconDictionary: Record<string, any> = {
    Kettlebell: kettlebell,
    'Box Platform': kettlebell,
    'Yoga Ball': kettlebell,
    'Workout Band': kettlebell,
    Dumbells: kettlebell,
    'Hanging Bar': kettlebell,
    None: kettlebell,
};

export const workoutDifficultyGradients = {
    easy: ['easyGreen', '#00C06E'],
    medium: ['#3f8fdf', '#0C5CAC'],
    hard: ['rgba(255, 159, 39, 17)', 'flameCherry.500'],
    extreme: ['flameCherry.900', 'cherry.600'],
};

export const getWorkoutDifficultyGradient = (difficulty: Difficulty): string[] => {
    let difficultyColor;

    switch (difficulty) {
        case Difficulty.Basic:
            difficultyColor = workoutDifficultyGradients.easy;
            break;
        case Difficulty.Intermediate:
            difficultyColor = workoutDifficultyGradients.medium;
            break;
        case Difficulty.Advanced:
            difficultyColor = workoutDifficultyGradients.hard;
            break;
        default:
            difficultyColor = workoutDifficultyGradients.easy;
            break;
    }

    return difficultyColor;
};

// export const getOldWorkoutDifficultyGradient = (numberOfTabatas: number): string[] => {
//     let difficultyColor;

//     switch (true) {
//         case numberOfTabatas > 9:
//             difficultyColor = workoutDifficultyGradients.extreme;
//             break;
//         case numberOfTabatas > 6:
//             difficultyColor = workoutDifficultyGradients.hard;
//             break;
//         case numberOfTabatas > 3:
//             difficultyColor = workoutDifficultyGradients.medium;
//             break;
//         default:
//             difficultyColor = workoutDifficultyGradients.easy;
//             break;
//     }

//     return difficultyColor;
// };
