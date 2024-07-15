import { TabataExercise } from '../types/workouts';

export enum Intervals {
    Warmup = 'Warmup',
    Exercise = 'Exercise',
    Rest = 'Rest',
    Intermission = 'Intermission',
    Cooldown = 'Cooldown',
}

export const lowerBodyExercises: Record<string, TabataExercise> = {
    Squats: {
        _id: 'lb1', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    Lunges: {
        _id: 'lb2', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    'Glute Bridges': {
        _id: 'lb3', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    'Step-Ups': {
        _id: 'lb4', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Calf Raises': {
        _id: 'lb5', name: 'Calf Raises', types: ['Lower Body'], description: 'Raise heels standing on toes.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    'Side Lunges': {
        _id: 'lb6', name: 'Side Lunges', types: ['Lower Body'], description: 'Lunge to the side.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Dumbbell Romanian Deadlift': {
        _id: 'lb9', name: 'Dumbbell Romanian Deadlift', types: ['Lower Body'], description: 'Deadlift with dumbells in each hand.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Jump Squats': {
        _id: 'lb10', name: 'Jump Squats', types: ['Lower Body'], description: 'Squat followed by a jump.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Box Jumps': {
        _id: 'lb11', name: 'Box Jumps', types: ['Lower Body'], equipment: ['Box Platform'], description: 'Jump onto a raised platform and back down.', difficulty: 'Intermediate', videoLink: '',
    },
    'Kettlebell Swings': {
        _id: 'lb12', name: 'Kettlebell Swings', types: ['Lower Body'], equipment: ['Kettlebell'], description: 'Swing a kettlebell up and down.', difficulty: 'Intermediate', videoLink: '',
    },
    'Kettlebell Deadlift': {
        _id: 'lb999', name: 'Kettlebell Deadlift', types: ['Lower Body'], equipment: ['Workout Band'], description: 'Deadlift with a kettlebell.', difficulty: 'Intermediate', videoLink: '',
    },
    'Yoga Ball Squats': {
        _id: 'lb14', name: 'Yoga Ball Squats', types: ['Lower Body'], equipment: ['Yoga Ball'], description: 'Squats against a yoga ball placed on a wall.', difficulty: 'Basic', videoLink: '',
    },
    'Alternating Jump Lunges': {
        _id: 'lb13', name: 'Alternating Jump Lunges', types: ['Lower Body'], description: 'Jump lunges alternating legs.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Single-Leg Glute Bridge': {
        _id: 'lb15', name: 'Single-Leg Glute Bridge', types: ['Lower Body'], description: 'Bridge with one leg lifted.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
};

export const upperBodyExercises: Record<string, TabataExercise> = {
    'Push-Ups': {
        _id: 'ub1', name: 'Push-Ups', types: ['Upper Body'], description: 'Standard push-ups.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    'Box Dips': {
        _id: 'ub10', name: 'Box Dips', types: ['Upper Body'], description: 'Dips on a box or sturdy surface.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Kettlebell Shoulder Press': {
        _id: 'ub11', name: 'Kettlebell Shoulder Press', types: ['Upper Body'], equipment: ['Kettlebell'], description: 'Press a kettlebell overhead.', difficulty: 'Intermediate', videoLink: '',
    },
    'Kettlebell Tricep Press': {
        _id: 'ub101', name: 'Kettlebell Tricep Press', types: ['Upper Body'], equipment: ['Kettlebell'], description: 'Press a kettlebell behind your head extending your triceps.', difficulty: 'Intermediate', videoLink: '',
    },
    'Dumbbell Flyes': {
        _id: 'ub12', name: 'Dumbbell Flyes', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Extend arms with dumbbells in a flying motion.', difficulty: 'Intermediate', videoLink: '',
    },
    'Pull ups': {
        _id: 'ub14', name: 'Pull ups', types: ['Upper Body'], equipment: ['Hanging Bar'], description: 'Pull up to the bar.', difficulty: 'Advanced', videoLink: '',
    },
    'Dumbbell Shoulder Press': {
        _id: 'ub15', name: 'Dumbbell Shoulder Press', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Press dumbbells overhead.', difficulty: 'Intermediate', videoLink: '',
    },
    'Dumbbell Bicep Curls': {
        _id: 'ub16', name: 'Dumbbell Bicep Curls', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Curl dumbbells towards your shoulders.', difficulty: 'Basic', videoLink: '',
    },
    'Dumbbell Delt Flyes': {
        _id: 'ub17', name: 'Dumbbell Delt Flyes', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Extend arms out to the sides with dumbbells.', difficulty: 'Intermediate', videoLink: '',
    },
    'Dumbbell Lying Chest Press': {
        _id: 'ub18', name: 'Dumbbell Lying Chest Press', types: ['Upper Body'], equipment: ['Dumbells'], description: 'Press dumbbells while lying on a bench.', difficulty: 'Intermediate', videoLink: '',
    },
};

export const absExercises: Record<string, TabataExercise> = {
    Crunches: {
        _id: 'abs1', name: 'Crunches', types: ['Abs'], description: 'Basic crunches for core.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    'Lying Leg Raises': {
        _id: 'abs2', name: 'Lying Leg Raises', types: ['Abs'], description: 'Lift legs for lower abs.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    Planks: {
        _id: 'abs3', name: 'Planks', types: ['Abs'], description: 'Hold a plank position for core strength.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Russian Twists': {
        _id: 'abs4', name: 'Russian Twists', types: ['Abs'], description: 'Twist torso with feet off the ground.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Bicycle Crunches': {
        _id: 'abs5', name: 'Bicycle Crunches', types: ['Abs'], description: 'Alternate elbow to knee in a cycling motion.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Mountain Climbers': {
        _id: 'abs6', name: 'Mountain Climbers', types: ['Abs'], description: 'Drive knees in towards chest.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'V-Ups': {
        _id: 'abs7', name: 'V-Ups', types: ['Abs'], description: 'Lift legs and torso to form a V shape.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Flutter Kicks': {
        _id: 'abs8', name: 'Flutter Kicks', types: ['Abs'], description: 'Kick legs up and down in a small range.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Plank Jacks': {
        _id: 'abs10', name: 'Plank Jacks', types: ['Abs'], description: 'Jump feet in and out while in plank position.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Around the Worlds': {
        _id: 'abs11', name: 'Around the Worlds', types: ['Abs'], equipment: ['Kettlebell'], description: 'Swing the kettlebell around your body.', difficulty: 'Intermediate', videoLink: '',
    },
    'Dumbbell Side Bends': {
        _id: 'abs12', name: 'Dumbbell Side Bends', types: ['Abs'], equipment: ['Dumbells'], description: 'Bend to each side holding a dumbbell.', difficulty: 'Intermediate', videoLink: '',
    },
    'Yoga Ball Crunches': {
        _id: 'abs13', name: 'Yoga Ball Crunches', types: ['Abs'], equipment: ['Yoga Ball'], description: 'Crunches on a yoga ball.', difficulty: 'Basic', videoLink: '',
    },
    'Windshield Wipers': {
        _id: 'abs15', name: 'Windshield Wipers', types: ['Abs'], description: 'Rotate legs side to side in a controlled motion.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Hollow Rocks': {
        _id: 'abs14', name: 'Hollow Rocks', types: ['Abs'], description: 'Rock forward and back in a strong hollow position.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    Inchworm: {
        _id: 'abs77', name: 'Inchworm', types: ['Upper Body'], description: 'Walk hands forward from a standing position.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
};

export const cardioExercises: Record<string, TabataExercise> = {
    'High Knees': {
        _id: 'cardio1', name: 'High Knees', types: ['Cardio'], description: 'Run in place with high knees.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    Burpees: {
        _id: 'cardio2', name: 'Burpees', types: ['Cardio', 'Abs'], description: 'Full body exercise with a jump.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Jumping Jacks': {
        _id: 'cardio4', name: 'Jumping Jacks', types: ['Cardio'], description: 'Jump with spread legs and clapping hands overhead.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    Skaters: {
        _id: 'cardio5', name: 'Skaters', types: ['Cardio'], description: 'Leap side to side in a skating motion.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Butt Kicks': {
        _id: 'cardio6', name: 'Butt Kicks', types: ['Cardio'], description: 'Run in place kicking heels to glutes.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    'Speed Skaters': {
        _id: 'cardio9', name: 'Speed Skaters', types: ['Cardio'], description: 'Side-to-side leaping with a slight squat.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
    'Fast Feet': {
        _id: 'cardio10', name: 'Fast Feet', types: ['Cardio'], description: 'Quickly shuffle feet in place.', difficulty: 'Basic', videoLink: '', equipment: ['None'],
    },
    Sprints: {
        _id: 'cardio15', name: 'Sprints', types: ['Cardio'], description: 'Run at full speed.', difficulty: 'Advanced', videoLink: '', equipment: ['None'],
    },
    'Bear Crawl': {
        _id: 'cardio16', name: 'Bear Crawl', types: ['Upper Body'], description: 'Crawl on all fours, keeping your knees off the ground.', difficulty: 'Intermediate', videoLink: '', equipment: ['None'],
    },
};
