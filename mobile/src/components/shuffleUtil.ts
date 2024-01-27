import {
    lowerBodyExercises, upperBodyExercises, absExercises, cardioExercises,
} from '../util/constants';
import {
    TabataCircuit, TabataEquipmentType, TabataExercise, TabataExerciseType, TabataWorkout,
} from '../types/workouts';

export const shuffleExercises = (
    numberOfTabatas: number,
    selectedEquipment: TabataEquipmentType[],
    includeUpper: boolean,
    includeLower: boolean,
    includeAbs: boolean,
    includeCardio: boolean,
): TabataCircuit[] => {
    const shuffleArray = <T, >(array: T[]): T[] => {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // eslint-disable-next-line no-param-reassign
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    const getRandomExercise = (type: TabataExerciseType): TabataExercise => {
        let exercises;

        switch (type) {
            case 'Lower Body':
                exercises = shuffleArray(lowerBodyExercises);
                break;
            case 'Upper Body':
                exercises = shuffleArray(upperBodyExercises);
                break;
            case 'Abs':
                exercises = shuffleArray(absExercises);
                break;
            case 'Cardio':
                exercises = shuffleArray(cardioExercises);
                break;
            // Include cases for 'Glutes' and 'Spicy' if you have exercises for them
            default:
                exercises = [];
        }

        const filteredExercises = exercises.filter((exercise) => exercise.equipment.some((equip) => selectedEquipment.includes(equip) || equip === 'None'));

        return filteredExercises.length > 0 ? filteredExercises[0] : exercises[0];
    };

    const createTabataCircuit = (types: TabataExerciseType[]): TabataCircuit => {
        const circuit: TabataCircuit = [];

        const shuffledTypes = shuffleArray(types); // Shuffle to randomize the starting point

        for (let i = 0; i < 4; i++) {
            circuit.push(getRandomExercise(shuffledTypes[i % shuffledTypes.length]));
        }

        return circuit;
    };

    const createTabataCircuits = (types: TabataExerciseType[]): TabataCircuit[] => {
        const circuits: TabataCircuit[] = [];

        for (let i = 0; i < numberOfTabatas; i++) {
            circuits.push(createTabataCircuit(types));
        }

        return circuits;
    };

    const types: TabataExerciseType[] = [];

    if (includeUpper) types.push('Upper Body');
    if (includeLower) types.push('Lower Body');
    if (includeAbs) types.push('Abs');
    if (includeCardio) types.push('Cardio');

    const tabtats: TabataCircuit[] = createTabataCircuits(types);

    return tabtats;
};

export const defaultTabataWorkout: TabataWorkout = {
    _id: `workout-shuffle`,
    name: `Tabata Shuffle`,
    description: 'A shuffled Tabata workout based on user preferences.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 1,
    tabatas: [],
    restDuration: 1,
    exerciseDuration: 1,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 1,
    cooldownDuration: 0,
    equipment: [],
};

export const defaultShuffleTabataWorkout: TabataWorkout = {
    _id: `workout-shuffle`,
    name: `Tabata Shuffle`,
    description: 'A shuffled Tabata workout based on user preferences.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 1,
    tabatas: [],
    restDuration: 1,
    exerciseDuration: 1,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 1,
    cooldownDuration: 0,
    equipment: [],
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
};

export const emptyTabata: TabataCircuit = [null, null, null, null];

export const buildNewTabataInitialState: TabataWorkout = {
    _id: `workout-shuffle`,
    name: `Tabata Shuffle`,
    description: 'A Tabata workout built by the user.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 1,
    tabatas: [emptyTabata],
    restDuration: 1,
    exerciseDuration: 1,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 1,
    cooldownDuration: 0,
    equipment: [],
    includeSettings: {
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
        includeUpper: true,
    },
};
