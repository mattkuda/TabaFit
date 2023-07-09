import React, { useState, useEffect } from 'react';
import { VStack, Text, Button, Input } from 'native-base';

const Timer = () => {
  const [tabatas, setTabatas] = useState(1);
  const exercisesPerTabata = 8;
  const [exercises, setExercises] = useState(exercisesPerTabata * tabatas);
  const [workInterval, setWorkInterval] = useState(20);
  const [restInterval, setRestInterval] = useState(10);
  const cooldownInterval = 60;

  const [currentInterval, setCurrentInterval] = useState('work');
  const [exercisesDone, setExercisesDone] = useState(0);
  const [tabatasDone, setTabatasDone] = useState(0);
  const [seconds, setSeconds] = useState(workInterval);
  const [isActive, setIsActive] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const toggle = () => {
    setIsActive(!isActive);
  }

  const reset = () => {
    setIsReset(true);
    setIsActive(false);
    setCurrentInterval('work');
    setExercisesDone(0);
    setTabatasDone(0);
    setSeconds(workInterval);
    setRemainingTime(totalWorkoutTime);
    setExercises(exercisesPerTabata * tabatas);
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (minutes * 60);

    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = minutes < 10 ? "0" + minutes : minutes;
    const secsStr = seconds < 10 ? "0" + seconds : seconds;

    return hours > 0 ? `${hoursStr}:${minsStr}:${secsStr}` : `${minsStr}:${secsStr}`;
  }

  useEffect(() => {
    setTotalWorkoutTime(tabatas * (exercisesPerTabata * (workInterval + restInterval) + cooldownInterval) - cooldownInterval);
    setRemainingTime(tabatas * (exercisesPerTabata * (workInterval + restInterval) + cooldownInterval) - cooldownInterval);
  }, [tabatas, workInterval, restInterval]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isReset) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
          setRemainingTime(remainingTime - 1);
        } else {
          if (exercisesDone >= exercises) {
            setIsActive(false);
          } else if (exercisesDone % exercisesPerTabata === 0 && exercisesDone > 0) {
            setCurrentInterval('cooldown');
            setSeconds(cooldownInterval);
            setTabatasDone(tabatasDone + 1);
          } else if (currentInterval === 'work') {
            setCurrentInterval('rest');
            setSeconds(restInterval);
            setExercisesDone(exercisesDone + 1);
          } else if (currentInterval === 'rest' || currentInterval === 'cooldown') {
            setCurrentInterval('work');
            setSeconds(workInterval);
          } 
        }
      }, 1000);
    } else if (!isActive && seconds !== 0 && !isReset) {
      if(interval){
        clearInterval(interval);
      }
    } else if (isReset) {
      setIsReset(false);
    }

    return () => {
      if(interval){
        clearInterval(interval);
      }
    };
  }, [isActive, seconds, isReset, exercises, exercisesDone, workInterval, restInterval, currentInterval, remainingTime]);

  return (
    <VStack space={4} alignItems='center'>
      <Text>{`Total remaining time: ${formatTime(remainingTime)}`}</Text>
      <Text fontSize="6xl" color={currentInterval === 'work' ? 'green.500' : currentInterval === 'cooldown' ? 'orange.500' : 'yellow.500'}>
        {formatTime(seconds)}
        </Text>
      <Text>{`${exercisesDone}/${exercises} exercises done`}</Text>
      <Text>{`${tabatasDone}/${tabatas} tabatas done`}</Text>
      <Text>{`Current: ${currentInterval.toUpperCase()}`}</Text>
      <Input 
        defaultValue={tabatas.toString()}
        onChangeText={(valueString) => setTabatas(parseInt(valueString))}
        width="40%" // you can change this to be whatever you like
      />
      <Button onPress={toggle}>{isActive ? 'Pause' : 'Start'}</Button>
      <Button onPress={reset}>Reset</Button>
    </VStack>
  );
}

export default Timer;
