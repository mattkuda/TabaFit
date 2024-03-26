import { extendTheme, theme as baseTheme } from 'native-base';

const customFontFamily = 'YourCustomFontName';

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
