// src/global.d.ts

// allow ANY import from ../../../backend/src/data/.../*.json
declare module '../../../backend/src/data/**/*.json' {
    const value: any;
    export default value;
}

// also allow imports from any other .json if needed
declare module '*.json' {
    const value: any;
    export default value;
}
