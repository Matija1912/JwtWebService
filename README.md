Welcome to JWT web service project.

Inside jwt-native-implementation folder there is an npm package source code, you can remove it from the project since the package is published to npm.
Inside token_server folder there is the actuall app logic where jwt-native-implementation is used in practice (just run npm install and it should run fine).

The jwt-native-implementation package is written in C and there are (currently) two prebuilds (macos and windows) but don't worry even if those don't fit your system node-gyp-build will make sure to recompile source C code for your system.
