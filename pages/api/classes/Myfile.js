export class Myfile {
  constructor(uuid, filename, filesize, chunks) {
    this._uuid = uuid;
    this._filename = filename;
    this._filesize = filesize;
    this._chunksTotal = chunks;
    this._bufferArray = new Array(this.chunksTotal);
  }

  get uuid() {
    return this._uuid;
  }
  get filename() {
    return this._filename;
  }
  get filesize() {
    return this._filesize;
  }

  get chunksTotal() {
    return this._chunksTotal;
  }
  get bufferArray() {
    return this._bufferArray;
  }

 missingPackets() {
    let missingPacks = [];

    for (let i = 0; i < this._bufferArray.length; i++) {
      if (this._bufferArray[i] == null) {
        missingPacks.push(i);
      }
      
    }
    return missingPacks;
  }
  /*
  set uuid(newuuid) {
    this._uuid = newuuid;
  }
  
  set filename(filename) {
    this.filename = filename;
  }
  set filesize(filesize) {
    this.filesize = filesize;
  }

  set chunksTotal(chunksTotal) {
    this.chunksTotal = chunksTotal;
  }
  */
}
