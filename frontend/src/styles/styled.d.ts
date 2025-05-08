// src/styles/styled.d.ts
import 'styled-components';


declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      textSubtle: string;
      circleBg: string;
      white: string;
      black: string;
      greyLight: string;
      grey: string;
      greyDark: string;
    };
    fonts: {
      main: string;
      heading: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    borderRadius: string;
    border: {
      default: string;
      subtle: string;
      highlight: string;
    };
    transitions: {
      default: string;
    };
  }
}
