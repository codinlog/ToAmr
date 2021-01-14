
const AMRParams = {
    HEADER: [35, 33, 65, 77, 82, 10], WHATSHEADER: "#!AMR\n",
    /** Decoding modes and its frame sizes (bytes), respectively */
    AmrModes: {
        0: 12, 1: 13, 2: 15, 3: 17, 4: 19, 5: 20, 6: 26, 7: 31
    }
};

class AMREncoder {
    constructor(options) {
        this.frameSize = options.frameSize || 160;
        this.amrMode = options.amrMode || 5; // MR795 by default
        this.blockSize = AMRParams.AmrModes[this.amrMode];
        this.dtx = 0;
        this.init();
    }

    init() {
        /* Create Encoder */
        this.state = opencoreamr.Encoder_Interface_init(this.dtx);
        this.input = opencoreamr.allocate(this.frameSize, 'i16', opencoreamr.ALLOC_STATIC);
        this.buffer = opencoreamr.allocate(this.blockSize, 'i8', opencoreamr.ALLOC_STATIC);
    }

    /**
     * Copy the samples to the input buffer
     */
    read(offset, length, data) {
        let len = offset + length > data.length ? data.length - offset : length;
        for (let m = offset - 1, k = 0; ++m < offset + len; k += 2) {
            opencoreamr.setValue(this.input + k, data[m], 'i16');
        }
        return len;
    }

    /* Copy to the output buffer */
    write(offset, nb, addr) {
        for (let m = 0, k = offset - 1; ++k < offset + nb; m += 1) {
            this.output[k] = opencoreamr.getValue(addr + m, "i8");
        }
    }

    writeHeader() {
        for (let i = -1; ++i < 6;) {
            this.output[i] = AMRParams.HEADER[i];
        }
    }

    process(pcmData) {
        let totalPackets = Math.ceil(pcmData.length / this.frameSize);
        let estimatedSize = this.blockSize * totalPackets;
        if (!this.output || this.output.length < estimatedSize) {
            this.output = new Uint8Array(estimatedSize + 6);
        }
        this.writeHeader();
        let outputOffset = 6;
        for (let offset = 0; offset < pcmData.length;) {
            /* Frames to the input buffer */
            let len = this.read(offset, this.frameSize, pcmData);
            /* Encode the frame */
            let nb = opencoreamr.Encoder_Interface_Encode(this.state, this.amrMode
                , this.input, this.buffer, 0);
            /* Write the size and frame */
            this.write(outputOffset, nb, this.buffer);
            outputOffset += nb;
            offset += len;
        }
        return this.output.subarray(0, outputOffset);
    }

    close() {
        opencoreamr.Encoder_Interface_exit(this.state);
    }
}

// export default AMREncoder;
this.AMREncoder = AMREncoder;
