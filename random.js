
function Random(seed) {
    this.state = new RC4(seed);
}

Random.prototype.byte = function() {
    return this.state.next(); 
}

Random.prototype.uniform = function() {
    const BYTES = 7;
    var output = 0;
    for (var i = 0; i < BYTES; i++) {
        output *= 256;
        output += this.byte();
    }
    return output / (Math.pow(2, BYTES * 8) - 1);
};