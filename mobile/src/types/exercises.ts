export interface Exercise {
    _id: string;
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    videoLink: string;
}

export const exercises: Exercise[] = [
    {
        _id: '1',
        name: 'Burpees',
        description: 'A full body exercise that combines a squat, push-up, and jump.',
        difficulty: 'Hard',
        videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
    },
    {
        _id: '2',
        name: 'Lying Leg Raises',
        description: 'An exercise for the abs and hips, performed lying down on the back.',
        difficulty: 'Medium',
        videoLink: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    },
    {
        _id: '3',
        name: 'Jump Squats',
        description: 'A high-intensity exercise that builds lower-body strength.',
        difficulty: 'Medium',
        videoLink: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    },
    {
        _id: '4',
        name: 'Jumping Jacks',
        description: 'A classic cardio exercise that raises your heart rate and improves stamina.',
        difficulty: 'Easy',
        videoLink: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    },
];
