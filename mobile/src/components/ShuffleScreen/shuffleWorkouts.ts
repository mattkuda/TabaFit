import {
    lowerBodyExercises, upperBodyExercises, absExercises, cardioExercises,
} from '../../util/constants';
import {
    TabataCircuit, TabataExercise, TabataExerciseType, TabataWorkout,
} from '../../types/workouts';

export const shuffleWorkout = (
    numberOfTabatas: number,
    includeUpper: boolean,
    includeLower: boolean,
    includeAbs: boolean,
    includeCardio: boolean,
    userId: string,
): TabataWorkout => {
    // Helper function to shuffle an array
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

    // Function to get a random exercise of a given type
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
        return exercises[0]; // Return the first exercise after shuffling
    };

    // Function to create a Tabata circuit
    const createTabataCircuit = (types: TabataExerciseType[]): TabataCircuit => {
        const circuit: TabataCircuit = [];

        const shuffledTypes = shuffleArray(types); // Shuffle to randomize the starting point

        for (let i = 0; i < 4; i++) {
            circuit.push(getRandomExercise(shuffledTypes[i % shuffledTypes.length]));
        }

        return [...circuit, ...circuit]; // Each exercise is done twice
    };

    // Function to create Tabata circuits
    const createTabataCircuits = (types: TabataExerciseType[]): TabataCircuit[] => {
        const circuits: TabataCircuit[] = [];

        for (let i = 0; i < numberOfTabatas; i++) {
            circuits.push(createTabataCircuit(types));
        }

        return circuits;
    };

    // Define the types included in the workout
    const types: TabataExerciseType[] = [];

    if (includeUpper) types.push('Upper Body');
    if (includeLower) types.push('Lower Body');
    if (includeAbs) types.push('Abs');
    if (includeCardio) types.push('Cardio');

    // Create the Tabata workout
    const workout: TabataWorkout = {
        _id: `workout-shuffle`,
        name: `Tabata Shuffle`,
        description: 'A shuffled Tabata workout based on user preferences.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        warmupDuration: 1,
        tabatas: createTabataCircuits(types),
        restDuration: 1,
        exerciseDuration: 1,
        numberOfTabatas: 1,
        exercisesPerTabata: 8,
        intermisionDuration: 1,
        cooldownDuration: 0,
        equipment: [],
    };

    return workout;
};
