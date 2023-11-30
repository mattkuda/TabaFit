// Utility function to calculate total workout time
export const calculateTotalWorkoutTime = (
    warmupDuration: number,
    exerciseDuration: number,
    restDuration: number,
    numberOfTabatas: number,
    exercisesPerTabata: number,
    intermisionDuration: number,
    cooldownDuration: number,
): number => {
    // Total time for one circuit
    const timePerCircuit = exercisesPerTabata * (exerciseDuration + restDuration);

    // Total time for all circuits
    const totalCircuitTime = timePerCircuit * numberOfTabatas;

    // Total time for intermissions (one less than the number of tabatas)
    const totalIntermisionTime = (numberOfTabatas - 1) * intermisionDuration;

    // Total workout time
    return warmupDuration + totalCircuitTime + totalIntermisionTime + cooldownDuration;
};

export const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const currSeconds = time - (hours * 3600) - (minutes * 60);

    const hoursStr = hours < 10 ? `0${hours}` : hours;
    const minsStr = minutes < 10 ? `0${minutes}` : minutes;
    const secsStr = currSeconds < 10 ? `0${currSeconds}` : currSeconds;

    return hours > 0 ? `${hoursStr}:${minsStr}:${secsStr}` : `${minsStr}:${secsStr}`;
};
