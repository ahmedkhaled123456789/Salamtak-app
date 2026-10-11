// Real-network jest config for src/api/live.test.ts (jest-expo replaces fetch with a native stub).
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/api/live.test.ts'],
  transform: { '^.+\.[jt]sx?$': ['babel-jest', { presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-transform-modules-commonjs'] }] },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native$': '<rootDir>/tests/stubs/react-native.js',
    '^expo-constants$': '<rootDir>/tests/stubs/empty.js',
    '^expo-secure-store$': '<rootDir>/tests/stubs/empty.js',
    '^expo-crypto$': '<rootDir>/tests/stubs/empty.js',
    '^expo-localization$': '<rootDir>/tests/stubs/empty.js',
  },
  globals: { __DEV__: true },
};
