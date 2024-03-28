import { extendTheme, theme as baseTheme } from 'native-base';

const customFontFamily = '';

export const theme = extendTheme({
    colors: {
        primary: baseTheme.colors.blue,
        flame: '#F3754B',
        gray10: baseTheme.colors.gray[1000],
        gray9: baseTheme.colors.gray[900],
        gray8: baseTheme.colors.gray[800],
        gray7: baseTheme.colors.gray[700],
        gray6: baseTheme.colors.gray[600],
        gray5: baseTheme.colors.gray[500],
        gray4: baseTheme.colors.gray[400],
        gray3: baseTheme.colors.gray[300],
        gray2: baseTheme.colors.gray[200],
        gray1: baseTheme.colors.gray[200],
        white: baseTheme.colors.white,

    },
    fontConfig: {
        YourCustomFontName: {
            400: {
                normal: customFontFamily,
                italic: customFontFamily,
            },
            500: {
                normal: customFontFamily,
                italic: customFontFamily,
            },
        },
    },
    fonts: {
        heading: customFontFamily,
        body: customFontFamily,
        mono: customFontFamily,
    },
    components: {
        Text: {
            defaultProps: {
                color: 'white',
            },
        },
        Input: {
            defaultProps: {
                color: 'white',
                backgroundColor: 'gray9',
                borderColor: 'gray7',
            },
        },
        Button: {
            defaultProps: {
                color: 'flame',
            },
            variants: {
                // eslint-disable-next-line consistent-return
                solid: ({ colorScheme }): any => {
                    if (colorScheme === 'primary') {
                        return {
                            bg: 'flame',
                            _text: {
                                color: 'white',
                            },

                        };
                    } if (colorScheme === 'secondary') {
                        return {
                            bg: 'white',
                            _text: {
                                color: 'flame',
                            },
                        };
                    }
                },
                // eslint-disable-next-line consistent-return
                outline: ({ colorScheme }): any => {
                    if (colorScheme === 'primary') {
                        return {
                            borderColor: 'flame',
                            _text: {
                                color: 'flame',
                            },

                        };
                    } if (colorScheme === 'secondary') {
                        return {
                            borderColor: 'white',
                            _text: {
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
                                color: 'flame',
                            },
                        };
                    } if (colorScheme === 'secondary') {
                        return {
                            _text: {
                                color: 'white',
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
