/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import {
    VStack, Text,
} from 'native-base';
import React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
// @ts-ignore
import logo from '../../../assets/tabafit-icon.png';
// @ts-ignore
import mattkuda from '../../../assets/mattkuda.png';
import { GradientVStack } from '../common/GradientVStack';

const styles = StyleSheet.create({
    logo: {
        maxWidth: '80%',
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
        alignSelf: 'center',
    },
    circularImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
});

export const AboutScreen: React.FC = () => (
    <GradientVStack
        flex={1}
        width="100%"
    >
        <ScrollView>
            <VStack height="100%" justifyContent="flex-start" style={{ padding: 20, gap: 8 }}>
                <Image
                    alt="TabaFit Logo"
                    source={logo}
                    style={[styles.logo]}
                />
                <Text color="white" fontSize="xl" fontWeight="bold" mt={4} textAlign="center">
                    Our Mission
                </Text>
                <Text color="white" mt={2} textAlign="center">
                    At TabaFit, we strive to foster and grow the Tabata community by creating a supportive and engaging environment.
                    Our goal is to motivate individuals to push their limits and achieve their fitness goals through high-intensity
                    workouts that offer cardiovascular improvements and fat-burning effects.
                </Text>
                <Text color="white" textAlign="center">
                    By equipping our members with the right tools and resources, we empower them to live an active and healthy lifestyle.
                    Tabata workouts are easily accessible due to their minimal equipment requirements and can be performed anywhere,
                    from the gym, to their apartment, to the beach.
                </Text>

                <Text color="white" fontSize="xl" fontWeight="bold" mt={4} textAlign="center">
                    Our History
                </Text>
                <Text color="white" mt={2} textAlign="center">
                    Development began in Fall 2023.
                </Text>

                <Text color="white" textAlign="center">
                    Alpha was launched in Summer 2024.
                </Text>
                <Text color="white" textAlign="center">
                    Public release coming soon!
                </Text>

                <Text color="white" fontSize="xl" fontWeight="bold" mt={4} textAlign="center">
                    Our Team
                </Text>
                <Image
                    alt="kuda"
                    source={mattkuda}
                    style={[styles.circularImage]}
                />
                <Text color="white" textAlign="center">
                    Hi I'm Matt, the developer of TabaFit. As fullstack software engineer, this is my first mobile app.
                    Besides Tabata, I stay active with volleyball, yoga, and hiking.
                    Let's connect!
                </Text>
                <Text color="white" mt={2} textAlign="center">
                    mattkuda.com
                </Text>
                <Text color="white" mt={2} textAlign="center">
                    @mattkuda on Twitter
                </Text>
            </VStack>
        </ScrollView>
    </GradientVStack>
);
