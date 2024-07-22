import { exerciseDict } from '../util/constants';
import {
    Difficulty,
    TabataCircuit, TabataExercise, TabataExerciseType, TabataWorkout, WorkoutEquipmentSettings,
} from '../types/workouts';

export const shuffleExercises = (
    numberOfTabatas: number,
    selectedEquipment: WorkoutEquipmentSettings,
    includeUpper: boolean,
    includeLower: boolean,
    includeAbs: boolean,
    includeCardio: boolean,
    difficulty: Difficulty,
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

    const equipmentFilter = (exercise: TabataExercise): boolean => {
        if (!exercise.difficulty.includes(difficulty)) {
            return false;
        }

        if (!exercise.equipment?.length) {
            return true;
        }
        return exercise.equipment.some((equip) => (equip === 'Kettlebell' && selectedEquipment.useKettlebell)
            || (equip === 'Box Platform' && selectedEquipment.useBoxPlatform)
            || (equip === 'Yoga Ball' && selectedEquipment.useYogaBall)
            || (equip === 'Workout Band' && selectedEquipment.useWorkoutBand)
            || (equip === 'Dumbells' && selectedEquipment.useDumbells)
            || (equip === 'Hanging Bar' && selectedEquipment.useHangingBar));
    };

    const getShuffledExercises = (): (type: TabataExerciseType) => TabataExercise[] => {
        const exercises = Object.values(exerciseDict);

        const shuffledExercises = {
            'Lower Body': exercises.filter((e) => e.types.includes('Lower Body')),
            'Upper Body': exercises.filter((e) => e.types.includes('Upper Body')),
            Abs: exercises.filter((e) => e.types.includes('Abs')),
            Cardio: exercises.filter((e) => e.types.includes('Cardio')),
        };

        return (type: TabataExerciseType): TabataExercise[] => shuffledExercises[type];
    };

    const getRandomExercise = (type: TabataExerciseType): TabataExercise => {
        const exercises = getShuffledExercises()(type);
        const filteredExercises = exercises.filter(equipmentFilter);

        return filteredExercises.length > 0
            ? filteredExercises[0]
            : null;
    };

    const createTabataCircuit = (types: TabataExerciseType[]): TabataCircuit => {
        const circuit: TabataCircuit = [];

        const shuffledTypes = shuffleArray(types); // Shuffle to randomize the starting point

        for (let i = 0; i < 4; i++) {
            const exercise = getRandomExercise(shuffledTypes[i % shuffledTypes.length]);

            if (exercise) circuit.push(exercise);
            else circuit.push(null); // Handle case where no exercise matches the criteria
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

    return createTabataCircuits(types);
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
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
};

export const shuffleWorkoutTemplate: TabataWorkout = {
    _id: `workout-shuffle-template`,
    name: `Tabata Shuffle`,
    description: 'A shuffled Tabata workout based on user preferences.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 5,
    tabatas: [],
    restDuration: 10,
    exerciseDuration: 20,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 60,
    cooldownDuration: 0,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
    difficulty: Difficulty.Basic,
};

export const shuffleWorkoutZeroState: TabataWorkout = {
    _id: `workout-shuffle-zero`,
    name: `Tabata Shuffle`,
    description: 'A shuffled Tabata workout based on user preferences.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 5,
    tabatas: [],
    restDuration: 10,
    exerciseDuration: 20,
    numberOfTabatas: 4,
    exercisesPerTabata: 8,
    intermisionDuration: 60,
    cooldownDuration: 0,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
    difficulty: Difficulty.Basic,
};

export const soundTestingWorkout: TabataWorkout = {
    _id: `sound-shuffle`,
    name: `Sound Testing Shuffle`,
    description: 'A sound test Tabata workout based on user preferences.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 5,
    tabatas: [],
    restDuration: 5,
    exerciseDuration: 5,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 5,
    cooldownDuration: 5,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
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
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
};

export const emptyTabata: TabataCircuit = [null, null, null, null];

export const buildNewTabataInitialState: TabataWorkout = {
    _id: `workout-custom`,
    name: '',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 5,
    tabatas: [emptyTabata],
    restDuration: 10,
    exerciseDuration: 20,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 60,
    cooldownDuration: 0,
    difficulty: Difficulty.Basic,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
        includeUpper: true,
    },
};
