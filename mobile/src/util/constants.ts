/* eslint-disable max-len */
import { TabataExercise } from '../types/workouts';

export enum Intervals {
    Warmup = 'Warmup',
    Exercise = 'Exercise',
    Rest = 'Rest',
    Intermission = 'Intermission',
    Cooldown = 'Cooldown',
}

export const exerciseDict: Record<string, TabataExercise> = {
    squats: {
        _id: 'squats', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Basic', equipment: ['None'],
    },
    lunges: {
        _id: 'lunges', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Basic', equipment: ['None'],
    },
    'glute-bridges': {
        _id: 'glute-bridges', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Basic', equipment: ['None'],
    },
    'step-ups': {
        _id: 'step-ups', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Intermediate', equipment: ['Box Platform'],
    },
    'calf-raises': {
        _id: 'calf-raises', name: 'Calf Raises', types: ['Lower Body'], description: 'Raise heels standing on toes.', difficulty: 'Basic', equipment: ['None'],
    },
    'side-lunges': {
        _id: 'side-lunges', name: 'Side Lunges', types: ['Lower Body'], description: 'Lunge to the side.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'dumbbell-romanian-deadlift': {
        _id: 'dumbbell-romanian-deadlift', name: 'Dumbbell Romanian Deadlift', types: ['Lower Body'], description: 'Deadlift with dumbells in each hand.', difficulty: 'Advanced', equipment: ['None'],
    },
    'jump-squats': {
        _id: 'jump-squats', name: 'Jump Squats', types: ['Lower Body'], description: 'Squat followed by a jump.', difficulty: 'Advanced', equipment: ['None'],
    },
    'box-jumps': {
        _id: 'box-jumps', name: 'Box Jumps', types: ['Lower Body'], description: 'Jump onto a raised platform and back down.', difficulty: 'Intermediate', equipment: ['Box Platform'],
    },
    'kettlebell-swings': {
        _id: 'kettlebell-swings', name: 'Kettlebell Swings', types: ['Lower Body'], description: 'Swing a kettlebell up and down.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'kettlebell-deadlift': {
        _id: 'kettlebell-deadlift', name: 'Kettlebell Deadlift', types: ['Lower Body'], description: 'Deadlift with a kettlebell.', difficulty: 'Intermediate', equipment: ['Workout Band'],
    },
    'yoga-ball-squats': {
        _id: 'yoga-ball-squats', name: 'Yoga Ball Squats', types: ['Lower Body'], description: 'Squats against a yoga ball placed on a wall.', difficulty: 'Basic', equipment: ['Yoga Ball'],
    },
    'alternating-jump-lunges': {
        _id: 'alternating-jump-lunges', name: 'Alternating Jump Lunges', types: ['Lower Body'], description: 'Jump lunges alternating legs.', difficulty: 'Advanced', equipment: ['None'],
    },
    'single-leg-glute-bridge': {
        _id: 'single-leg-glute-bridge', name: 'Single-Leg Glute Bridge', types: ['Lower Body'], description: 'Bridge with one leg lifted.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'push-ups': {
        _id: 'push-ups', name: 'Push-Ups', types: ['Upper Body'], description: 'Standard push-ups.', difficulty: 'Basic', equipment: ['None'],
    },
    'box-dips': {
        _id: 'box-dips', name: 'Box Dips', types: ['Upper Body'], description: 'Dips on a box or sturdy surface.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'kettlebell-shoulder-press': {
        _id: 'kettlebell-shoulder-press', name: 'Kettlebell Shoulder Press', types: ['Upper Body'], description: 'Press a kettlebell overhead.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'kettlebell-tricep-press': {
        _id: 'kettlebell-tricep-press', name: 'Kettlebell Tricep Press', types: ['Upper Body'], description: 'Press a kettlebell behind your head extending your triceps.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'dumbbell-flyes': {
        _id: 'dumbbell-flyes', name: 'Dumbbell Flyes', types: ['Upper Body'], description: 'Extend arms with dumbbells in a flying motion.', difficulty: 'Intermediate', equipment: ['Dumbells'],
    },
    'pull-ups': {
        _id: 'pull-ups', name: 'Pull ups', types: ['Upper Body'], description: 'Pull up to the bar.', difficulty: 'Advanced', equipment: ['Hanging Bar'],
    },
    'dumbbell-shoulder-press': {
        _id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', types: ['Upper Body'], description: 'Press dumbbells overhead.', difficulty: 'Intermediate', equipment: ['Dumbells'],
    },
    'dumbbell-bicep-curls': {
        _id: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls', types: ['Upper Body'], description: 'Curl dumbbells towards your shoulders.', difficulty: 'Basic', equipment: ['Dumbells'],
    },
    'dumbbell-delt-flyes': {
        _id: 'dumbbell-delt-flyes', name: 'Dumbbell Delt Flyes', types: ['Upper Body'], description: 'Extend arms out to the sides with dumbbells.', difficulty: 'Intermediate', equipment: ['Dumbells'],
    },
    'dumbbell-lying-chest-press': {
        _id: 'dumbbell-lying-chest-press', name: 'Dumbbell Lying Chest Press', types: ['Upper Body'], description: 'Press dumbbells while lying on a bench.', difficulty: 'Intermediate', equipment: ['Dumbells'],
    },
    crunches: {
        _id: 'crunches', name: 'Crunches', types: ['Abs'], description: 'Basic crunches for core.', difficulty: 'Basic', equipment: ['None'],
    },
    'lying-leg-raises': {
        _id: 'lying-leg-raises', name: 'Lying Leg Raises', types: ['Abs'], description: 'Lift legs for lower abs.', difficulty: 'Basic', equipment: ['None'],
    },
    planks: {
        _id: 'planks', name: 'Planks', types: ['Abs'], description: 'Hold a plank position for core strength.', difficulty: 'Basic', equipment: ['None'],
    },
    'russian-twists': {
        _id: 'russian-twists', name: 'Russian Twists', types: ['Abs'], description: 'Twist torso with feet off the ground.', difficulty: 'Basic', equipment: ['None'],
    },
    'bicycle-crunches': {
        _id: 'bicycle-crunches', name: 'Bicycle Crunches', types: ['Abs'], description: 'Alternate elbow to knee in a cycling motion.', difficulty: 'Basic', equipment: ['None'],
    },
    'mountain-climbers': {
        _id: 'mountain-climbers', name: 'Mountain Climbers', types: ['Abs'], description: 'Drive knees in towards chest.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'v-ups': {
        _id: 'v-ups', name: 'V-Ups', types: ['Abs'], description: 'Lift legs and torso to form a V shape.', difficulty: 'Advanced', equipment: ['None'],
    },
    'flutter-kicks': {
        _id: 'flutter-kicks', name: 'Flutter Kicks', types: ['Abs'], description: 'Kick legs up and down in a small range.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'plank-jacks': {
        _id: 'plank-jacks', name: 'Plank Jacks', types: ['Abs'], description: 'Jump feet in and out while in plank position.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'around-the-worlds': {
        _id: 'around-the-worlds', name: 'Around the Worlds', types: ['Abs'], description: 'Swing the kettlebell around your body.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'dumbbell-side-bends': {
        _id: 'dumbbell-side-bends', name: 'Dumbbell Side Bends', types: ['Abs'], description: 'Bend to each side holding a dumbbell.', difficulty: 'Intermediate', equipment: ['Dumbells'],
    },
    'yoga-ball-crunches': {
        _id: 'yoga-ball-crunches', name: 'Yoga Ball Crunches', types: ['Abs'], description: 'Crunches on a yoga ball.', difficulty: 'Basic', equipment: ['Yoga Ball'],
    },
    'windshield-wipers': {
        _id: 'windshield-wipers', name: 'Windshield Wipers', types: ['Abs'], description: 'Rotate legs side to side in a controlled motion.', difficulty: 'Advanced', equipment: ['None'],
    },
    'hollow-rocks': {
        _id: 'hollow-rocks', name: 'Hollow Rocks', types: ['Abs'], description: 'Rock forward and back in a strong hollow position.', difficulty: 'Advanced', equipment: ['None'],
    },
    inchworm: {
        _id: 'inchworm', name: 'Inchworm', types: ['Upper Body'], description: 'Walk hands forward from a standing position.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'high-knees': {
        _id: 'high-knees', name: 'High Knees', types: ['Cardio'], description: 'Run in place with high knees.', difficulty: 'Intermediate', equipment: ['None'],
    },
    burpees: {
        _id: 'burpees', name: 'Burpees', types: ['Cardio', 'Abs'], description: 'Full body exercise with a jump.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'jumping-jacks': {
        _id: 'jumping-jacks', name: 'Jumping Jacks', types: ['Cardio'], description: 'Jump with spread legs and clapping hands overhead.', difficulty: 'Basic', equipment: ['None'],
    },
    skaters: {
        _id: 'skaters', name: 'Skaters', types: ['Cardio'], description: 'Leap side to side in a skating motion.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'butt-kicks': {
        _id: 'butt-kicks', name: 'Butt Kicks', types: ['Cardio'], description: 'Run in place kicking heels to glutes.', difficulty: 'Basic', equipment: ['None'],
    },
    'speed-skaters': {
        _id: 'speed-skaters', name: 'Speed Skaters', types: ['Cardio'], description: 'Side-to-side leaping with a slight squat.', difficulty: 'Intermediate', equipment: ['None'],
    },
    'fast-feet': {
        _id: 'fast-feet', name: 'Fast Feet', types: ['Cardio'], description: 'Quickly shuffle feet in place.', difficulty: 'Basic', equipment: ['None'],
    },
    sprints: {
        _id: 'sprints', name: 'Sprints', types: ['Cardio'], description: 'Run at full speed.', difficulty: 'Advanced', equipment: ['None'],
    },
    'bear-crawl': {
        _id: 'bear-crawl', name: 'Bear Crawl', types: ['Upper Body'], description: 'Crawl on all fours, keeping your knees off the ground.', difficulty: 'Intermediate', equipment: ['None'],
    },
};
