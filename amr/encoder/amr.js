(function (global) {
  function AMR(params) {
    !params && (params = {});
    this.params = params;
    this.decoder = new AMRDecoder(params);
    this.encoder = new AMREncoder(params);
    this.init();
  }

  AMR.prototype.init = function () {
    this.encoder.init();
    this.decoder.init();
  };

  AMR.prototype.set = function (name, value) {
    this.options[name] = value;
  };

  AMR.prototype.enable = function (option) {
    this.set(option, true);
  };

  AMR.prototype.disable = function (option) {
    this.set(option, false);
  };

  /**
   * Initialize the codec
   */
  AMR.prototype.init = function () {
    this.encoder.init();
    this.decoder.init();
  };

  /**
   * @argument pcmdata Float32Array|Int16Array
   * @returns String|Uint8Array
   */
  AMR.prototype.encode = function (data) {
    return this.encoder.process(data);
  };

  /**
   * @argument encoded String|Uint8Array
   * @returns Float32Array
   */
  AMR.prototype.decode = function (bitstream) {
    return this.decoder.process(bitstream);
  };

  /**
   * Closes the codec
   */
  AMR.prototype.close = function () {
    this.encoder.close();
    this.decoder.close();
  };

  AMR.onerror = function (message, code) {
    console.error("AMR Error " + code + ": " + message);
  };
  global.AMR = AMR;
})(this);
