export default class AMREncoder {
  amrType: number;
  frameSize: number;
  blockSize: number;
  constructor({ amrType, frameSize, blockSize }) {
    this.amrType = amrType;
    this.frameSize = frameSize;
    this.blockSize = blockSize;
  }
  init() {}
}
