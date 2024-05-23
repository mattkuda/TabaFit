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
        _id: 'lb1', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb2', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb3', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb4', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb5', name: 'Calf Raises', types: ['Lower Body'], description: 'Raise heels standing on toes.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb6', name: 'Side Lunges', types: ['Lower Body'], description: 'Lunge to the side.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb9', name: 'Dumbbell Romanian Deadlift', types: ['Lower Body'], description: 'Deadlift with dumbells in each hand.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb10', name: 'Jump Squats', types: ['Lower Body'], description: 'Squat followed by a jump.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb11', name: 'Box Jumps', types: ['Lower Body'], equipment: ['Box Platform'], description: 'Jump onto a raised platform and back down.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb12', name: 'Kettlebell Swings', types: ['Lower Body'], equipment: ['Kettlebell'], description: 'Swing a kettlebell up and down.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb12', name: 'Kettlebell Swings', types: ['Lower Body'], equipment: ['Kettlebell'], description: 'Swing a kettlebell up and down.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb999', name: 'Kettlebell Deadlift', types: ['Lower Body'], equipment: ['Workout Band'], description: 'Deadlift with a kettlebell.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'lb14', name: 'Yoga Ball Squats', types: ['Lower Body'], equipment: ['Yoga Ball'], description: 'Squats against a yoga ball placed on a wall.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'lb13', name: 'Alternating Jump Lunges', types: ['Lower Body'], description: 'Jump lunges alternating legs.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'lb15', name: 'Single-Leg Glute Bridge', types: ['Lower Body'], description: 'Bridge with one leg lifted.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
];

export const upperBodyExercises: TabataExercise[] = [
    {
        _id: 'ub1', name: 'Push-Ups', types: ['Upper Body'], description: 'Standard push-ups.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'ub10', name: 'Box Dips', types: ['Upper Body'], description: 'Dips on a box or sturdy surface.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'ub11', name: 'Kettlebell Shoulder Press', types: ['Upper Body'], equipment: ['Kettlebell'], description: 'Press a kettlebell overhead.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub101', name: 'Kettlebell Tricep Press', types: ['Upper Body'], equipment: ['Kettlebell'], description: 'Press a kettlebell behind your head extending your triceps.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub12', name: 'Dumbbell Flyes', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Extend arms with dumbbells in a flying motion.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub14', name: 'Pull ups', types: ['Upper Body'], equipment: ['Hanging Bar'], description: 'Pull up to the bar.', difficulty: 'Hard', videoLink: '',
    },
    {
        _id: 'ub15', name: 'Dumbbell Shoulder Press', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Press dumbbells overhead.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub16', name: 'Dumbbell Bicep Curls', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Curl dumbbells towards your shoulders.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'ub17', name: 'Dumbbell Delt Flyes', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Extend arms out to the sides with dumbbells.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'ub18', name: 'Dumbbell Lying Chest Press', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Press dumbbells while lying on a bench.', difficulty: 'Medium', videoLink: '',
    },
];

export const absExercises: TabataExercise[] = [
    {
        _id: 'abs1', name: 'Crunches', types: ['Abs'], description: 'Basic crunches for core.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs2', name: 'Leg Raises', types: ['Abs'], description: 'Lift legs for lower abs.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs3', name: 'Planks', types: ['Abs'], description: 'Hold a plank position for core strength.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs4', name: 'Russian Twists', types: ['Abs'], description: 'Twist torso with feet off the ground.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs5', name: 'Bicycle Crunches', types: ['Abs'], description: 'Alternate elbow to knee in a cycling motion.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs6', name: 'Mountain Climbers', types: ['Abs'], description: 'Drive knees in towards chest.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs7', name: 'V-Ups', types: ['Abs'], description: 'Lift legs and torso to form a V shape.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs8', name: 'Flutter Kicks', types: ['Abs'], description: 'Kick legs up and down in a small range.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs10', name: 'Plank Jacks', types: ['Abs'], description: 'Jump feet in and out while in plank position.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs11', name: 'Around the Worlds', types: ['Abs'], equipment: ['Kettlebell'], description: 'Swing the kettlebell around your body.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs12', name: 'Dumbbell Side Bends', types: ['Abs'], equipment: ['Dumbells'], description: 'Bend to each side holding a dumbbell.', difficulty: 'Medium', videoLink: '',
    },
    {
        _id: 'abs13', name: 'Yoga Ball Crunches', types: ['Abs'], equipment: ['Yoga Ball'], description: 'Crunches on a yoga ball.', difficulty: 'Easy', videoLink: '',
    },
    {
        _id: 'abs15', name: 'Windshield Wipers', types: ['Abs'], description: 'Rotate legs side to side in a controlled motion.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs14', name: 'Hollow Rocks', types: ['Abs'], description: 'Rock forward and back in a strong hollow position.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'abs77', name: 'Inchworm', types: ['Upper Body'], description: 'Walk hands forward from a standing position.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
];

export const cardioExercises: TabataExercise[] = [
    {
        _id: 'cardio1', name: 'High Knees', types: ['Cardio'], description: 'Run in place with high knees.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio2', name: 'Burpees', types: ['Cardio'], description: 'Full body exercise with a jump.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio3', name: 'Mountain Climbers', types: ['Cardio'], description: 'Rapid knee drives from a plank position.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio4', name: 'Jumping Jacks', types: ['Cardio'], description: 'Jump with spread legs and clapping hands overhead.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio5', name: 'Skaters', types: ['Cardio'], description: 'Leap side to side in a skating motion.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio6', name: 'Butt Kicks', types: ['Cardio'], description: 'Run in place kicking heels to glutes.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        // Move this to lower body
        _id: 'cardio8', name: 'Squat Jumps', types: ['Cardio'], description: 'Squat down and jump up explosively.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio9', name: 'Speed Skaters', types: ['Cardio'], description: 'Side-to-side leaping with a slight squat.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio10', name: 'Fast Feet', types: ['Cardio'], description: 'Quickly shuffle feet in place.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio15', name: 'Sprints', types: ['Cardio'], description: 'Run at full speed.', difficulty: 'Hard', videoLink: '', equipment: ['None'],
    },
    {
        _id: 'cardio16', name: 'Bear Crawl', types: ['Upper Body'], description: 'Crawl on all fours, keeping your knees off the ground.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
    },
];

// export const hardcodedExercises: Exercise[] = [
//     {
//         _id: '1',
//         name: 'Burpees',
//         description: 'A full body exercise that combines a squat, push-up, and jump.',
//         difficulty: 'Hard',
//         videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=1fO8DGHK4Eo',
//     },
//     {
//         _id: '2',
//         name: 'Lying Leg Raises',
//         description: 'An exercise for the abs and hips, performed lying down on the back.',
//         difficulty: 'Medium',
//         videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=JB2oyawG9KI',
//     },
//     {
//         _id: '3',
//         name: 'Jump Squats',
//         description: 'A high-intensity exercise that builds lower-body strength.',
//         difficulty: 'Medium',
//         videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=CVaEhXotL7M',
//     },
//     {
//         _id: '4',
//         name: 'Jumping Jacks',
//         description: 'A classic cardio exercise that raises your heart rate and improves stamina.',
//         difficulty: 'Easy',
//         videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=c4DAnQ6DtF8',
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
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=1fO8DGHK4Eo',
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
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         {
//             _id: '2',
//             name: 'Lying Leg Raises',
//             description: 'An exercise for the abs and hips, performed lying down on the back.',
//             difficulty: 'Medium',
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=JB2oyawG9KI',
//         },
//         {
//             _id: '3',
//             name: 'Jump Squats',
//             description: 'A high-intensity exercise that builds lower-body strength.',
//             difficulty: 'Medium',
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=CVaEhXotL7M',
//         },
//         {
//             _id: '4',
//             name: 'Jumping Jacks',
//             description: 'A classic cardio exercise that raises your heart rate and improves stamina.',
//             difficulty: 'Easy',
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=c4DAnQ6DtF8',
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
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         {
//             _id: '2',
//             name: 'Lying Leg Raises',
//             description: 'An exercise for the abs and hips, performed lying down on the back.',
//             difficulty: 'Medium',
//             videoLink: 'https equipment: ['None']://www.youtube.com/watch?v=JB2oyawG9KI',
//         }],
//         restDuration: 10,
//         exerciseDuration: 20,
//         circuits: 4,
//         intermisionDuration: 180,
//         cooldownDuration: 5,
//     },
//     // More workouts...
// ];
