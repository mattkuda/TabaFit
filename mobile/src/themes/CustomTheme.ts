import { extendTheme, theme as baseTheme } from 'native-base';

// const customFontFamily = '';

export const theme = extendTheme({
    colors: {
        gray: {
            800: '#182329',
            900: '#0f1317',
        },
        cardGray: '#182329',
        // This is the gray from whoop
        workoutDisplayGray: '#31373c',
        displayGray: '#71777C',
        primary: '#ff9f27',
        // To make tints, use https://maketintsandshades.com/#ff2760
        // black: '#121212'
        flame: {
            100: '#ffecd4',
            200: '#ffd9a9',
            300: '#ffc57d',
            400: '#ffb252',
            500: '#ff9f27',
            600: '#cc7f1f',
            700: '#995f17',
            800: '#664010',
            900: '#332008',
        },
        flameCherry: {
            100: '#FF942C',

            200: '#FF8931',

            300: '#FF7E37',

            400: '#FF733C',

            500: '#FF6841',

            600: '#FF5E46',

            700: '#FF534B',

            800: '#FF4850',

            900: '#FF3D56',

            1000: '#FF325B',
        },

        // cherry: '#"ff2760',"
        cherry: {
            100: '#ffd4df',
            200: '#ffa9bf',
            300: '#ff7da0',
            400: '#ff5280',
            500: '#ff2760',
            600: '#cc1f4d',
            700: '#99173a',
            800: '#661026',
            900: '#330813',
        },
        blue: {
            100: '#E6F0FF',
            200: '#CCE1FF',
            300: '#99C2FF',
            400: '#66A3FF',
            500: '#3385FF',
            600: '#0066FF',
            700: '#0052CC',
            800: '#003D99',
            900: '#002966',
        },
        // gray: {
        //     100: '#e6e6e5',
        //     200: '#cecdcc',
        //     300: '#b6b4b3',
        //     400: '#9e9d9b',
        //     500: '#878683',
        //     600: '#716f6c',
        //     700: '#5c5a56',
        //     800: '#474541',
        //     900: '#34312d',
        //     1000: '#211f1b',
        // },
        easyGreen: '#00f3a1',
        success: '#00f3a1',
        gray10: baseTheme.colors.gray[1000],
        gray9: baseTheme.colors.gray[900],
        gray8: baseTheme.colors.gray[800],
        gray7: baseTheme.colors.gray[700],
        gray6: baseTheme.colors.gray[600],
        gray5: baseTheme.colors.gray[500],
        gray4: baseTheme.colors.gray[400],
        gray3: baseTheme.colors.gray[300],
        gray2: baseTheme.colors.gray[200],
    },
    // fontConfig: {
    //     YourCustomFontName: {
    //         400: {
    //             normal: customFontFamily,
    //             italic: customFontFamily,
    //         },
    //         500: {
    //             normal: customFontFamily,
    //             italic: customFontFamily,
    //         },
    //     },
    // },
    // fonts: {
    //     heading: customFontFamily,
    //     body: customFontFamily,
    //     mono: customFontFamily,
    // },
    components: {
        Modal: {
            Body: {
                defaultProps: {
                    color: 'gray9',
                    backgroundColor: 'gray9',
                    borderColor: 'gray7',
                },
            },
        },
        Text: {
            defaultProps: {
                color: 'white',
            },
        },
        Heading: {
            defaultProps: {
                color: 'white',
            },
        },
        Input: {
            defaultProps: {
                color: 'white',
                backgroundColor: 'gray.900',
                borderColor: 'gray7',
            },
        },
        TextArea: {
            defaultProps: {
                color: 'white',
                backgroundColor: 'gray9',
                borderColor: 'gray7',
            },
        },
        Button: {
            defaultProps: {
                color: 'primary',
            },
            variants: {
                // eslint-disable-next-line consistent-return
                solid: ({ colorScheme }): any => {
                    if (colorScheme === 'primary') {
                        return {
                            bg: 'primary',
                            _text: {
                                color: 'white',
                            },

                        };
                    } if (colorScheme === 'secondary') {
                        return {
                            bg: 'white',
                            _text: {
                                color: 'primary',
                            },
                        };
                    }
                },
                // eslint-disable-next-line consistent-return
                outline: ({ colorScheme }): any => {
                    if (colorScheme === 'primary') {
                        return {
                            borderColor: 'primary',
                            _text: {
                                color: 'primary',
                            },

                        };
                    } if (colorScheme === 'secondary') {
                        return {
                            borderColor: 'white',
                            _text: {
                                color: 'white',
                            },
                            _icon: {
                                color: 'white',
                            },
                        };
                    }
                },
                // eslint-disable-next-line consistent-return
                ghost: ({ colorScheme }): any => {
                    if (colorScheme === 'primary') {
                        return {
                            _text: {
                                color: 'primary',
                            },
                        };
                    }
                    if (colorScheme === 'secondary') {
                        return {
                            _text: {
                                color: 'white',
                            },
                        };
                    }
                    if (colorScheme === 'dull') {
                        return {
                            _text: {
                                color: 'gray7',
                            },
                        };
                    }
                },
            },
        },
        Icon: {
            defaultProps: {
                color: 'white',
            },
        },
        IconButton: {
            baseStyle: {
                _icon: {
                    color: 'white',
                },
            },
        },
        Avatar: {
            baseStyle: {
                borderColor: 'background',
            },
        },
    },
});
