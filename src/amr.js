// import AMREncoder from "./encoder";
class AMR {
    constructor(params) {
        !params && (params = {});
        this.encoder = new AMREncoder(params);
        this.init();
    }

    init() {
        debugger
        this.encoder.init();
    }

    encode(data) {
        return this.encoder.process(data);
    }

    close() {
        this.encoder.close();
    }
}

this.AMR = AMR;