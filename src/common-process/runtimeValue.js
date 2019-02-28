let _elapsed = 0;

class RuntimeValue {
    constructor() {
        _elapsed = 0;
    }

    getElapsed() {
        return _elapsed;
    }

    addElapsed(elapsed) {
        _elapsed += elapsed;
        if (_elapsed >= Number.MAX_VALUE) {
            _elapsed = 0;
        }
    }

    isElapsedGreaterThen(v) {
        return _elapsed >= v;
    }

    resetElapsed() {
        _elapsed = 0;
    }
}

module.exports = new RuntimeValue();