/* eslint-disable max-len */
import { TabataExercise } from '../types/workouts';

export enum Intervals {
    Warmup = 'Warmup',
    Exercise = 'Exercise',
    Rest = 'Rest',
    Intermission = 'Intermission',
    Cooldown = 'Cooldown',
}

export const exerciseDictOld: Record<string, TabataExercise> = {
    squats: {
        _id: 'squats', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Basic', equipment: [],
    },
    lunges: {
        _id: 'lunges', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Basic', equipment: [],
    },
    'glute-bridges': {
        _id: 'glute-bridges', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Basic', equipment: [],
    },
    'step-ups': {
        _id: 'step-ups', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Intermediate', equipment: ['Box Platform'],
    },
    'calf-raises': {
        _id: 'calf-raises', name: 'Calf Raises', types: ['Lower Body'], description: 'Raise heels standing on toes.', difficulty: 'Basic', equipment: [],
    },
    'side-lunges': {
        _id: 'side-lunges', name: 'Side Lunges', types: ['Lower Body'], description: 'Lunge to the side.', difficulty: 'Intermediate', equipment: [],
    },
    'dumbbell-romanian-deadlift': {
        _id: 'dumbbell-romanian-deadlift', name: 'Dumbbell Romanian Deadlift', types: ['Lower Body'], description: 'Deadlift with dumbbells in each hand.', difficulty: 'Advanced', equipment: [],
    },
    'jump-squats': {
        _id: 'jump-squats', name: 'Jump Squats', types: ['Lower Body'], description: 'Squat followed by a jump.', difficulty: 'Advanced', equipment: [],
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
        _id: 'alternating-jump-lunges', name: 'Alternating Jump Lunges', types: ['Lower Body'], description: 'Jump lunges alternating legs.', difficulty: 'Advanced', equipment: [],
    },
    'single-leg-glute-bridge': {
        _id: 'single-leg-glute-bridge', name: 'Single-Leg Glute Bridge', types: ['Lower Body'], description: 'Bridge with one leg lifted.', difficulty: 'Intermediate', equipment: [],
    },
    'push-ups': {
        _id: 'push-ups', name: 'Push-Ups', types: ['Upper Body'], description: 'Standard push-ups.', difficulty: 'Basic', equipment: [],
    },
    'box-dips': {
        _id: 'box-dips', name: 'Box Dips', types: ['Upper Body'], description: 'Dips on a box or sturdy surface.', difficulty: 'Intermediate', equipment: [],
    },
    'kettlebell-shoulder-press': {
        _id: 'kettlebell-shoulder-press', name: 'Kettlebell Shoulder Press', types: ['Upper Body'], description: 'Press a kettlebell overhead.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'kettlebell-tricep-press': {
        _id: 'kettlebell-tricep-press', name: 'Kettlebell Tricep Press', types: ['Upper Body'], description: 'Press a kettlebell behind your head extending your triceps.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'dumbbell-flyes': {
        _id: 'dumbbell-flyes', name: 'Dumbbell Flyes', types: ['Upper Body'], description: 'Extend arms with dumbbells in a flying motion.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'pull-ups': {
        _id: 'pull-ups', name: 'Pull ups', types: ['Upper Body'], description: 'Pull up to the bar.', difficulty: 'Advanced', equipment: ['Hanging Bar'],
    },
    'dumbbell-shoulder-press': {
        _id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', types: ['Upper Body'], description: 'Press dumbbells overhead.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'dumbbell-bicep-curls': {
        _id: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls', types: ['Upper Body'], description: 'Curl dumbbells towards your shoulders.', difficulty: 'Basic', equipment: ['Dumbbells'],
    },
    'dumbbell-delt-flyes': {
        _id: 'dumbbell-delt-flyes', name: 'Dumbbell Delt Flyes', types: ['Upper Body'], description: 'Extend arms out to the sides with dumbbells.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'dumbbell-lying-chest-press': {
        _id: 'dumbbell-lying-chest-press', name: 'Dumbbell Lying Chest Press', types: ['Upper Body'], description: 'Press dumbbells while lying on a bench.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    crunches: {
        _id: 'crunches', name: 'Crunches', types: ['Abs'], description: 'Basic crunches for core.', difficulty: 'Basic', equipment: [],
    },
    'lying-leg-raises': {
        _id: 'lying-leg-raises', name: 'Lying Leg Raises', types: ['Abs'], description: 'Lift legs for lower abs.', difficulty: 'Basic', equipment: [],
    },
    planks: {
        _id: 'planks', name: 'Planks', types: ['Abs'], description: 'Hold a plank position for core strength.', difficulty: 'Basic', equipment: [],
    },
    'russian-twists': {
        _id: 'russian-twists', name: 'Russian Twists', types: ['Abs'], description: 'Twist torso with feet off the ground.', difficulty: 'Basic', equipment: [],
    },
    'bicycle-crunches': {
        _id: 'bicycle-crunches', name: 'Bicycle Crunches', types: ['Abs'], description: 'Alternate elbow to knee in a cycling motion.', difficulty: 'Basic', equipment: [],
    },
    'mountain-climbers': {
        _id: 'mountain-climbers', name: 'Mountain Climbers', types: ['Abs'], description: 'Drive knees in towards chest.', difficulty: 'Intermediate', equipment: [],
    },
    'v-ups': {
        _id: 'v-ups', name: 'V-Ups', types: ['Abs'], description: 'Lift legs and torso to form a V shape.', difficulty: 'Advanced', equipment: [],
    },
    'flutter-kicks': {
        _id: 'flutter-kicks', name: 'Flutter Kicks', types: ['Abs'], description: 'Kick legs up and down in a small range.', difficulty: 'Intermediate', equipment: [],
    },
    'plank-jacks': {
        _id: 'plank-jacks', name: 'Plank Jacks', types: ['Abs'], description: 'Jump feet in and out while in plank position.', difficulty: 'Intermediate', equipment: [],
    },
    'around-the-worlds': {
        _id: 'around-the-worlds', name: 'Around the Worlds', types: ['Abs'], description: 'Swing the kettlebell around your body.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'dumbbell-side-bends': {
        _id: 'dumbbell-side-bends', name: 'Dumbbell Side Bends', types: ['Abs'], description: 'Bend to each side holding a dumbbell.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'yoga-ball-crunches': {
        _id: 'yoga-ball-crunches', name: 'Yoga Ball Crunches', types: ['Abs'], description: 'Crunches on a yoga ball.', difficulty: 'Basic', equipment: ['Yoga Ball'],
    },
    'windshield-wipers': {
        _id: 'windshield-wipers', name: 'Windshield Wipers', types: ['Abs'], description: 'Rotate legs side to side in a controlled motion.', difficulty: 'Advanced', equipment: [],
    },
    'hollow-rocks': {
        _id: 'hollow-rocks', name: 'Hollow Rocks', types: ['Abs'], description: 'Rock forward and back in a strong hollow position.', difficulty: 'Advanced', equipment: [],
    },
    inchworm: {
        _id: 'inchworm', name: 'Inchworm', types: ['Upper Body'], description: 'Walk hands forward from a standing position.', difficulty: 'Intermediate', equipment: [],
    },
    'high-knees': {
        _id: 'high-knees', name: 'High Knees', types: ['Cardio'], description: 'Run in place with high knees.', difficulty: 'Intermediate', equipment: [],
    },
    burpees: {
        _id: 'burpees', name: 'Burpees', types: ['Cardio', 'Abs'], description: 'Full body exercise with a jump.', difficulty: 'Intermediate', equipment: [],
    },
    'jumping-jacks': {
        _id: 'jumping-jacks', name: 'Jumping Jacks', types: ['Cardio'], description: 'Jump with spread legs and clapping hands overhead.', difficulty: 'Basic', equipment: [],
    },
    skaters: {
        _id: 'skaters', name: 'Skaters', types: ['Cardio'], description: 'Leap side to side in a skating motion.', difficulty: 'Intermediate', equipment: [],
    },
    'butt-kicks': {
        _id: 'butt-kicks', name: 'Butt Kicks', types: ['Cardio'], description: 'Run in place kicking heels to glutes.', difficulty: 'Basic', equipment: [],
    },
    'speed-skaters': {
        _id: 'speed-skaters', name: 'Speed Skaters', types: ['Cardio'], description: 'Side-to-side leaping with a slight squat.', difficulty: 'Intermediate', equipment: [],
    },
    'fast-feet': {
        _id: 'fast-feet', name: 'Fast Feet', types: ['Cardio'], description: 'Quickly shuffle feet in place.', difficulty: 'Basic', equipment: [],
    },
    sprints: {
        _id: 'sprints', name: 'Sprints', types: ['Cardio'], description: 'Run at full speed.', difficulty: 'Advanced', equipment: [],
    },
    'bear-crawl': {
        _id: 'bear-crawl', name: 'Bear Crawl', types: ['Upper Body'], description: 'Crawl on all fours, keeping your knees off the ground.', difficulty: 'Intermediate', equipment: [],
    },
};

export const exerciseDict: Record<string, TabataExercise> = {
    squats: {
        _id: 'squats', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Basic', equipment: [],
    },
    lunges: {
        _id: 'lunges', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Basic', equipment: [],
    },
    'glute-bridges': {
        _id: 'glute-bridges', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Basic', equipment: [],
    },
    'yoga-ball-squats': {
        _id: 'yoga-ball-squats', name: 'Yoga Ball Squats', types: ['Lower Body'], description: 'Squats against a yoga ball placed on a wall.', difficulty: 'Basic', equipment: ['Yoga Ball'],
    },
    'calf-raises': {
        _id: 'calf-raises', name: 'Calf Raises', types: ['Lower Body'], description: 'Raise heels standing on toes.', difficulty: 'Basic', equipment: [],
    },
    'side-lunges': {
        _id: 'side-lunges', name: 'Side Lunges', types: ['Lower Body'], description: 'Lunge to the side.', difficulty: 'Intermediate', equipment: [],
    },
    'curtsey-lunges': {
        _id: 'curtsey-lunges', name: 'Curtsey Lunges', types: ['Lower Body'], description: 'Step one leg behind the other into a lunge.', difficulty: 'Basic', equipment: [],
    },
    'jump-squats': {
        _id: 'jump-squats', name: 'Jump Squats', types: ['Lower Body'], description: 'Squat followed by a jump.', difficulty: 'Intermediate', equipment: [],
    },
    'reverse-lunge-knee-drive': {
        _id: 'reverse-lunge-knee-drive', name: 'Reverse Lunge to Knee Drive', types: ['Lower Body'], description: 'Step back into a lunge, then drive the knee up.', difficulty: 'Intermediate', equipment: [],
    },
    'dumbbell-romanian-deadlift': {
        _id: 'dumbbell-romanian-deadlift', name: 'Dumbbell Romanian Deadlift', types: ['Lower Body'], description: 'Deadlift with dumbbells in each hand.', difficulty: 'Basic', equipment: ['Dumbbells'],
    },
    'single-leg-glute-bridge': {
        _id: 'single-leg-glute-bridge', name: 'Single-Leg Glute Bridge', types: ['Lower Body'], description: 'Bridge with one leg lifted.', difficulty: 'Intermediate', equipment: [],
    },
    'box-jumps': {
        _id: 'box-jumps', name: 'Box Jumps', types: ['Lower Body'], description: 'Jump onto a raised platform and back down.', difficulty: 'Intermediate', equipment: ['Box Platform'],
    },
    'step-ups': {
        _id: 'step-ups', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Intermediate', equipment: ['Box Platform'],
    },
    'weighted-step-ups': {
        _id: 'weighted-step-ups', name: 'Weighted Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform holding weights.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'kettlebell-swings': {
        _id: 'kettlebell-swings', name: 'Kettlebell Swings', types: ['Lower Body'], description: 'Swing a kettlebell up and down.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'kettlebell-deadlift': {
        _id: 'kettlebell-deadlift', name: 'Kettlebell Deadlift', types: ['Lower Body'], description: 'Deadlift with a kettlebell.', difficulty: 'Intermediate', equipment: ['Workout Band'],
    },
    'pistol-squats': {
        _id: 'pistol-squats', name: 'Pistol Squats', types: ['Lower Body'], description: 'Single-leg squat.', difficulty: 'Intermediate', equipment: [],
    },
    'kettlebell-clean-press': {
        _id: 'kettlebell-clean-press', name: 'Kettlebell Clean and Press', types: ['Lower Body'], description: 'Clean and press a kettlebell.', difficulty: 'Advanced', equipment: ['Kettlebell'],
    },
    'tuck-jumps': {
        _id: 'tuck-jumps', name: 'Tuck Jumps', types: ['Lower Body'], description: 'Jump and tuck knees to chest.', difficulty: 'Intermediate', equipment: [],
    },
    'push-ups': {
        _id: 'push-ups', name: 'Push-Ups', types: ['Upper Body'], description: 'Standard push-ups.', difficulty: 'Basic', equipment: [],
    },
    'wide-push-ups': {
        _id: 'wide-push-ups', name: 'Wide Push-Ups', types: ['Upper Body'], description: 'Push-ups with hands spread at a wide distance.', difficulty: 'Basic', equipment: [],
    },
    'diamond-push-ups': {
        _id: 'diamond-push-ups', name: 'Diamond Push-Ups', types: ['Upper Body'], description: 'Push-ups with hands close together to target triceps.', difficulty: 'Intermediate', equipment: [],
    },
    'spiderman-push-ups': {
        _id: 'spiderman-push-ups', name: 'Spiderman Push-Ups', types: ['Upper Body'], description: 'Bring one knee towards the elbow as you lower in a push-up.', difficulty: 'Intermediate', equipment: [],
    },
    'push-up-shoulder-tap': {
        _id: 'push-up-shoulder-tap', name: 'Push-Up to Shoulder Tap', types: ['Upper Body'], description: 'Perform a push-up, then tap each shoulder with the opposite hand.', difficulty: 'Intermediate', equipment: [],
    },
    'plank-jab-cross': {
        _id: 'plank-jab-cross', name: 'Plank, Jab, Cross', types: ['Upper Body'], description: 'Hold plank, jab, and cross punches.', difficulty: 'Advanced', equipment: [],
    },
    inchworm: {
        _id: 'inchworm', name: 'Inchworm', types: ['Upper Body'], description: 'Walk hands forward from a standing position.', difficulty: 'Intermediate', equipment: [],
    },
    'box-dips': {
        _id: 'box-dips', name: 'Box Dips', types: ['Upper Body'], description: 'Dips on a box or sturdy surface.', difficulty: 'Basic', equipment: ['Box Platform'],
    },
    'tricep-kickbacks': {
        _id: 'tricep-kickbacks', name: 'Tricep Kickbacks', types: ['Upper Body'], description: 'Extend weights backward from bent-over position.', difficulty: 'Basic', equipment: ['Dumbbells'],
    },
    'bear-crawl': {
        _id: 'bear-crawl', name: 'Bear Crawl', types: ['Upper Body'], description: 'Crawl on all fours, keeping your knees off the ground.', difficulty: 'Intermediate', equipment: [],
    },
    'dumbbell-kettlebell-swings': {
        _id: 'dumbbell-kettlebell-swings', name: 'Dumbbell Kettlebell Swings', types: ['Upper Body'], description: 'Swing a dumbbell up and down.', difficulty: 'Basic', equipment: ['Dumbbells'],
    },
    'dumbbell-bicep-curls': {
        _id: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls', types: ['Upper Body'], description: 'Curl dumbbells towards your shoulders.', difficulty: 'Basic', equipment: ['Dumbbells'],
    },
    'dumbbell-flyes': {
        _id: 'dumbbell-flyes', name: 'Dumbbell Flyes', types: ['Upper Body'], description: 'Extend arms with dumbbells in a flying motion.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'dumbbell-shoulder-press': {
        _id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', types: ['Upper Body'], description: 'Press dumbbells overhead.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'dumbbell-delt-flyes': {
        _id: 'dumbbell-delt-flyes', name: 'Dumbbell Delt Flyes', types: ['Upper Body'], description: 'Extend arms out to the sides with dumbbells.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'dumbbell-lying-chest-press': {
        _id: 'dumbbell-lying-chest-press', name: 'Dumbbell Lying Chest Press', types: ['Upper Body'], description: 'Press dumbbells while lying on a bench.', difficulty: 'Intermediate', equipment: ['Dumbbells'],
    },
    'kettlebell-shoulder-press': {
        _id: 'kettlebell-shoulder-press', name: 'Kettlebell Shoulder Press', types: ['Upper Body'], description: 'Press a kettlebell overhead.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'kettlebell-tricep-press': {
        _id: 'kettlebell-tricep-press', name: 'Kettlebell Tricep Press', types: ['Upper Body'], description: 'Press a kettlebell behind your head extending your triceps.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'superman-raises': {
        _id: 'superman-raises', name: 'Superman Raises', types: ['Upper Body'], description: 'Lie on your stomach and lift arms and legs simultaneously.', difficulty: 'Intermediate', equipment: [],
    },
    'pull-ups': {
        _id: 'pull-ups', name: 'Pull ups', types: ['Upper Body'], description: 'Pull up to the bar.', difficulty: 'Advanced', equipment: ['Hanging Bar'],
    },
    crunches: {
        _id: 'crunches', name: 'Crunches', types: ['Abs'], description: 'Basic crunches for core.', difficulty: 'Basic', equipment: [],
    },
    'lying-leg-raises': {
        _id: 'lying-leg-raises', name: 'Lying Leg Raises', types: ['Abs'], description: 'Lift legs for lower abs.', difficulty: 'Basic', equipment: [],
    },
    planks: {
        _id: 'planks', name: 'Planks', types: ['Abs'], description: 'Hold a plank position for core strength.', difficulty: 'Basic', equipment: [],
    },
    'russian-twists': {
        _id: 'russian-twists', name: 'Russian Twists', types: ['Abs'], description: 'Twist torso with feet off the ground.', difficulty: 'Basic', equipment: [],
    },
    'bicycle-crunches': {
        _id: 'bicycle-crunches', name: 'Bicycle Crunches', types: ['Abs'], description: 'Alternate elbow to knee in a cycling motion.', difficulty: 'Basic', equipment: [],
    },
    'plank-shoulder-taps': {
        _id: 'plank-shoulder-taps', name: 'Plank Shoulder Taps', types: ['Abs'], description: 'Hold a plank position and alternate tapping shoulders with opposite hand.', difficulty: 'Basic', equipment: [],
    },
    'plank-hip-dips': {
        _id: 'plank-hip-dips', name: 'Plank Hip Dips', types: ['Abs'], description: 'Rotate hips from side to side while in plank position.', difficulty: 'Basic', equipment: [],
    },
    'mountain-climbers': {
        _id: 'mountain-climbers', name: 'Mountain Climbers', types: ['Abs'], description: 'Drive knees in towards chest.', difficulty: 'Intermediate', equipment: [],
    },
    'plank-jacks': {
        _id: 'plank-jacks', name: 'Plank Jacks', types: ['Abs'], description: 'Jump feet in and out while in plank position.', difficulty: 'Intermediate', equipment: [],
    },
    'flutter-kicks': {
        _id: 'flutter-kicks', name: 'Flutter Kicks', types: ['Abs'], description: 'Kick legs up and down in a small range.', difficulty: 'Basic', equipment: [],
    },
    'v-ups': {
        _id: 'v-ups', name: 'V-Ups', types: ['Abs'], description: 'Lift legs and torso to form a V shape.', difficulty: 'Intermediate', equipment: [],
    },
    'side-plank-star': {
        _id: 'side-plank-star', name: 'Side Plank Star', types: ['Abs'], description: 'Hold a side plank with the top leg and arm extended.', difficulty: 'Intermediate', equipment: [],
    },
    'windshield-wipers': {
        _id: 'windshield-wipers', name: 'Windshield Wipers', types: ['Abs'], description: 'Rotate legs side to side in a controlled motion.', difficulty: 'Advanced', equipment: [],
    },
    'hollow-rocks': {
        _id: 'hollow-rocks', name: 'Hollow Rocks', types: ['Abs'], description: 'Rock forward and back in a strong hollow position.', difficulty: 'Advanced', equipment: [],
    },
    'yoga-ball-crunches': {
        _id: 'yoga-ball-crunches', name: 'Yoga Ball Crunches', types: ['Abs'], description: 'Crunches on a yoga ball.', difficulty: 'Basic', equipment: ['Yoga Ball'],
    },
    'around-the-worlds': {
        _id: 'around-the-worlds', name: 'Around the Worlds', types: ['Abs'], description: 'Swing the kettlebell around your body.', difficulty: 'Intermediate', equipment: ['Kettlebell'],
    },
    'scissor-kicks': {
        _id: 'scissor-kicks', name: 'Scissor Kicks', types: ['Abs'], description: 'Lie on your back and alternate legs up and down in a scissor motion.', difficulty: 'Basic', equipment: [],
    },
    'cross-body-mountain-climbers': {
        _id: 'cross-body-mountain-climbers', name: 'Cross-Body Mountain Climbers', types: ['Abs'], description: 'Drive knees towards opposite elbows in a plank position.', difficulty: 'Intermediate', equipment: [],
    },
    'hip-raises': {
        _id: 'hip-raises', name: 'Hip Raises', types: ['Abs'], description: 'Lie on your back and lift hips straight up.', difficulty: 'Basic', equipment: [],
    },
    'boat-pose-hold': {
        _id: 'boat-pose-hold', name: 'Boat Pose Hold', types: ['Abs'], description: 'Hold a "V" position with legs and torso elevated.', difficulty: 'Intermediate', equipment: [],
    },
    sprints: {
        _id: 'sprints', name: 'Sprints', types: ['Cardio'], description: 'Run at full speed.', difficulty: 'Advanced', equipment: [],
    },
    'jumping-jacks': {
        _id: 'jumping-jacks', name: 'Jumping Jacks', types: ['Cardio'], description: 'Jump with spread legs and clapping hands overhead.', difficulty: 'Basic', equipment: [],
    },
    'lateral-hops': {
        _id: 'lateral-hops', name: 'Lateral Hops', types: ['Cardio'], description: 'Hop side to side over an imaginary line.', difficulty: 'Basic', equipment: [],
    },
    'butt-kicks': {
        _id: 'butt-kicks', name: 'Butt Kicks', types: ['Cardio'], description: 'Run in place kicking heels to glutes.', difficulty: 'Basic', equipment: [],
    },
    skaters: {
        _id: 'skaters', name: 'Skaters', types: ['Cardio'], description: 'Leap side to side in a skating motion.', difficulty: 'Basic', equipment: [],
    },
    'shadow-boxing': {
        _id: 'shadow-boxing', name: 'Shadow Boxing', types: ['Cardio'], description: 'Simulate boxing punches with fast uppercuts and jabs.', difficulty: 'Intermediate', equipment: [],
    },
    'invisible-jump-rope': {
        _id: 'invisible-jump-rope', name: 'Invisible Jump Rope', types: ['Cardio'], description: 'Simulate jumping rope with no rope, focusing on speed.', difficulty: 'Basic', equipment: [],
    },
    'high-knees': {
        _id: 'high-knees', name: 'High Knees', types: ['Cardio'], description: 'Run in place with high knees.', difficulty: 'Basic', equipment: [],
    },
    'fast-feet': {
        _id: 'fast-feet', name: 'Fast Feet', types: ['Cardio'], description: 'Quickly shuffle feet in place.', difficulty: 'Basic', equipment: [],
    },
    'speed-skaters': {
        _id: 'speed-skaters', name: 'Speed Skaters', types: ['Cardio'], description: 'Side-to-side leaping with a slight squat.', difficulty: 'Intermediate', equipment: [],
    },
    burpees: {
        _id: 'burpees', name: 'Burpees', types: ['Cardio', 'Abs'], description: 'Full body exercise with a jump.', difficulty: 'Basic', equipment: [],
    },
    'running-in-place': {
        _id: 'running-in-place', name: 'Running in Place', types: ['Cardio'], description: 'Simulate running without moving forward.', difficulty: 'Basic', equipment: [],
    },
    'broad-jumps': {
        _id: 'broad-jumps', name: 'Broad Jumps', types: ['Cardio'], description: 'Jump forward with both feet as far as possible.', difficulty: 'Intermediate', equipment: [],
    },
    punches: {
        _id: 'punches', name: 'Punches', types: ['Upper Body'], description: 'Punches in the air for upper body workout.', difficulty: 'Intermediate', equipment: [],
    },
};
