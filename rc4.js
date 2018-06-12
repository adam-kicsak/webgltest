
function RC4(seed) {
    this.i = this.j = 0;
    this.s = new Array(256);
    for (var i = 0; i < 256; i++) {
        this.s[i] = i;
    }
    this.mix(seed);
}

RC4.prototype.swap = function(i, j) {
    var tmp = this.s[i];
    this.s[i] = this.s[j];
    this.s[j] = tmp;
};

RC4.prototype.mix = function(seed) {
    var f64 = new Float64Array([seed]);
    var input = new Uint8Array(f64.buffer).filter(function(e, i, a) { return e != 0 });
    var j = 0;
    for (var i = 0; i < this.s.length; i++) {
        j += this.s[i] + input[i % input.length];
        j %= 256;
        this.swap(i, j);
    }
};

RC4.prototype.next = function() {
    this.i = (this.i + 1) % 256;
    this.j = (this.j + this.s[this.i]) % 256;
    this.swap(this.i, this.j);
    return this.s[(this.s[this.i] + this.s[this.j]) % 256];
};

