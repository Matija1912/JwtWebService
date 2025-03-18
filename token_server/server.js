const jwt = require('jwt-native-implementation');
const jsonwebtoken = require('jsonwebtoken');
const { performance } = require('perf_hooks');

const payload = { userId: 123 };
const secret = "your_secret_key";

function measureMemoryUsage(label, fn) {
    global.gc(); // Force garbage collection (requires running with --expose-gc)
    const startMemory = process.memoryUsage().heapUsed;
    const start = performance.now();

    fn(); // Run the function (sign/verify loop)

    const end = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    console.log(`${label} execution time: ${(end - start).toFixed(4)} ms`);
    console.log(`${label} memory usage: ${(endMemory - startMemory) / 1024} KB\n`);
}

// Measure your implementation
measureMemoryUsage("My JWT", () => {
    for (let i = 0; i < 2000; i++) {
        const token = jwt.sign(payload, secret);
        jwt.verify(token, secret);
    }
});

// Measure jsonwebtoken implementation
measureMemoryUsage("jsonwebtoken", () => {
    for (let i = 0; i < 2000; i++) {
        const token = jsonwebtoken.sign(payload, secret);
        jsonwebtoken.verify(token, secret);
    }
});
