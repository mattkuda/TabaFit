// import { Workout } from '../types/workouts';
// import { Exercise } from '../types/exercises';

import { TabataExercise } from '../types/workouts';

export enum Intervals {
    Warmup = 'Warmup',
    // eslint-disable-next-line @typescript-eslint/no-shadow
    Exercise = 'Exercise',
    Rest = 'Rest',
    Intermission = 'Intermission',
    Cooldown = 'Cooldown',
}

export const lowerBodyExercises: TabataExercise[] = [
    {
        _id: 'lb1', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'lb2', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'lb3', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'lb4', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb5', name: 'Calf Raises', types: ['Lower Body'], description: 'Raise heels standing on toes.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'lb6', name: 'Side Lunges', types: ['Lower Body'], description: 'Lunge to the side.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb7', name: 'Donkey Kicks', types: ['Lower Body'], description: 'Kick back with knees bent.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'lb8', name: 'Wall Sit', types: ['Lower Body'], description: 'Sit against a wall without a chair.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb9', name: 'Single Leg Deadlift', types: ['Lower Body'], description: 'Lift one leg behind as you bend forward.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'lb10', name: 'Jump Squats', types: ['Lower Body'], description: 'Squat followed by a jump.', difficulty: 'Hard', videoLink: '',
    },
];

export const upperBodyExercises: TabataExercise[] = [
    {
        _id: 'ub1', name: 'Push-Ups', types: ['Upper Body'], description: 'Standard push-ups.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub2', name: 'Tricep Dips', types: ['Upper Body'], description: 'Dips using a chair or bench.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub3', name: 'Pike Push-Ups', types: ['Upper Body'], description: 'Push-ups with elevated hips for shoulder focus.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'ub4', name: 'Arm Circles', types: ['Upper Body'], description: 'Rotate arms in large circles.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'ub5', name: 'Diamond Push-Ups', types: ['Upper Body'], description: 'Push-ups with hands forming a diamond shape.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'ub6', name: 'Plank Ups', types: ['Upper Body'], description: 'Start in a plank, then push up to a push-up position.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub7', name: 'Superman', types: ['Upper Body'], description: 'Lie down, extend arms, and lift chest and legs.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'ub8', name: 'Bear Crawl', types: ['Upper Body'], description: 'Crawl on all fours, keeping your knees off the ground.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub9', name: 'Inchworm', types: ['Upper Body'], description: 'Walk hands forward from a standing position.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub10', name: 'Box Dips', types: ['Upper Body'], description: 'Dips on a box or sturdy surface.', difficulty: 'Medium', videoLink: '',
    },
];

export const absExercises: TabataExercise[] = [
    {
        _id: 'abs1', name: 'Crunches', types: ['Abs'], description: 'Basic crunches for core.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'abs2', name: 'Leg Raises', types: ['Abs'], description: 'Lift legs for lower abs.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs3', name: 'Planks', types: ['Abs'], description: 'Hold a plank position for core strength.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs4', name: 'Russian Twists', types: ['Abs'], description: 'Twist torso with feet off the ground.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs5', name: 'Bicycle Crunches', types: ['Abs'], description: 'Alternate elbow to knee in a cycling motion.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs6', name: 'Mountain Climbers', types: ['Abs'], description: 'Drive knees in towards chest.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs7', name: 'V-Ups', types: ['Abs'], description: 'Lift legs and torso to form a V shape.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'abs8', name: 'Flutter Kicks', types: ['Abs'], description: 'Kick legs up and down in a small range.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs9', name: 'Reverse Crunches', types: ['Abs'], description: 'Lift hips off the ground.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'abs10', name: 'Plank Jacks', types: ['Abs'], description: 'Jump feet in and out while in plank position.', difficulty: 'Medium', videoLink: '',
    },
];

export const cardioExercises: TabataExercise[] = [
    {
        _id: 'cardio1', name: 'High Knees', types: ['Cardio'], description: 'Run in place with high knees.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'cardio2', name: 'Burpees', types: ['Cardio'], description: 'Full body exercise with a jump.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'cardio3', name: 'Mountain Climbers', types: ['Cardio'], description: 'Rapid knee drives from a plank position.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'cardio4', name: 'Jumping Jacks', types: ['Cardio'], description: 'Jump with spread legs and clapping hands overhead.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'cardio5', name: 'Skaters', types: ['Cardio'], description: 'Leap side to side in a skating motion.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'cardio6', name: 'Butt Kicks', types: ['Cardio'], description: 'Run in place kicking heels to glutes.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'cardio7', name: 'Tuck Jumps', types: ['Cardio'], description: 'Jump and bring knees to chest.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'cardio8', name: 'Squat Jumps', types: ['Cardio'], description: 'Squat down and jump up explosively.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'cardio9', name: 'Speed Skaters', types: ['Cardio'], description: 'Side-to-side leaping with a slight squat.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'cardio10', name: 'Fast Feet', types: ['Cardio'], description: 'Quickly shuffle feet in place.', difficulty: 'Easy', videoLink: '',
    },
];

// export const hardcodedExercises: Exercise[] = [
//     {
//         _id: '1',
//         name: 'Burpees',
//         description: 'A full body exercise that combines a squat, push-up, and jump.',
//         difficulty: 'Hard',
//         videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//     },
//     {
//         _id: '2',
//         name: 'Lying Leg Raises',
//         description: 'An exercise for the abs and hips, performed lying down on the back.',
//         difficulty: 'Medium',
//         videoLink: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
//     },
//     {
//         _id: '3',
//         name: 'Jump Squats',
//         description: 'A high-intensity exercise that builds lower-body strength.',
//         difficulty: 'Medium',
//         videoLink: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
//     },
//     {
//         _id: '4',
//         name: 'Jumping Jacks',
//         description: 'A classic cardio exercise that raises your heart rate and improves stamina.',
//         difficulty: 'Easy',
//         videoLink: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
//     },
// ];

// export const hardcodedWorkouts: Workout[] = [
//     {
//         _id: '1',
//         name: 'Lightning Workout (for testing)',
//         createdAt: '2023-07-08T00:00:00Z',
//         updatedAt: '2023-07-08T00:00:00Z',
//         userId: '123',
//         warmupDuration: 1,
//         exercises: [{
//             _id: '1',
//             name: 'Burpees',
//             description: 'A full body exercise that combines a squat, push-up, and jump.',
//             difficulty: 'Hard',
//             videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         ],
//         restDuration: 1,
//         exerciseDuration: 1,
//         circuits: 1,
//         intermisionDuration: 1,
//         cooldownDuration: 1,
//     }, {
//         _id: '1',
//         name: 'Workout 1',
//         createdAt: '2023-07-08T00:00:00Z',
//         updatedAt: '2023-07-08T00:00:00Z',
//         userId: '123',
//         warmupDuration: 5,
//         exercises: [{
//             _id: '1',
//             name: 'Burpees',
//             description: 'A full body exercise that combines a squat, push-up, and jump.',
//             difficulty: 'Hard',
//             videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         {
//             _id: '2',
//             name: 'Lying Leg Raises',
//             description: 'An exercise for the abs and hips, performed lying down on the back.',
//             difficulty: 'Medium',
//             videoLink: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
//         },
//         {
//             _id: '3',
//             name: 'Jump Squats',
//             description: 'A high-intensity exercise that builds lower-body strength.',
//             difficulty: 'Medium',
//             videoLink: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
//         },
//         {
//             _id: '4',
//             name: 'Jumping Jacks',
//             description: 'A classic cardio exercise that raises your heart rate and improves stamina.',
//             difficulty: 'Easy',
//             videoLink: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
//         }],
//         restDuration: 60,
//         exerciseDuration: 20,
//         circuits: 4,
//         intermisionDuration: 60,
//         cooldownDuration: 5,
//     },
//     {
//         _id: '2',
//         name: 'Workout 2',
//         createdAt: '2023-07-08T00:00:00Z',
//         updatedAt: '2023-07-08T00:00:00Z',
//         userId: '123',
//         warmupDuration: 5,
//         exercises: [{
//             _id: '1',
//             name: 'Burpees',
//             description: 'A full body exercise that combines a squat, push-up, and jump.',
//             difficulty: 'Hard',
//             videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         {
//             _id: '2',
//             name: 'Lying Leg Raises',
//             description: 'An exercise for the abs and hips, performed lying down on the back.',
//             difficulty: 'Medium',
//             videoLink: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
//         }],
//         restDuration: 10,
//         exerciseDuration: 20,
//         circuits: 4,
//         intermisionDuration: 180,
//         cooldownDuration: 5,
//     },
//     // More workouts...
// ];
