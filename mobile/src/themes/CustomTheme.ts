import { extendTheme, theme as baseTheme } from 'native-base';

const customFontFamily = 'YourCustomFontName';

export const theme = extendTheme({
    colors: {
        primary: baseTheme.colors.blue,
        background: baseTheme.colors.gray[900],
        background2: baseTheme.colors.gray[700],
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
