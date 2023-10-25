
import multer from "multer";
import { Myfile } from "./classes/Myfile";
const { spawn,exec, execFile, fork, execSync, spawnSync } = require('child_process');

const fs = require("fs");

// TODO: try performance on hdd/ssd
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const config = {
  api: {
    bodyParser: false, 
  },
};
let fileStore = [];
let uploadPath = "uploads/"

let ipfsPath = "pages/api/kubo/"


export default async (req, res) => {


  // start ipfs daemon
  //const stop = spawn(ipfsPath+"ipfs", ['shutdown']);
  const sp_process = spawn(ipfsPath+"ipfs", ['daemon']);

  // const sp_process = spawn(ipfsPath+"ipfs-update", ['install latest']); //update ipfs
  





  upload.single("chunk")(req, res, async function (err) {
    
    if (req.file) {
      let uuid = req.body.fileId;
      let index = req.body.chunkIndex;
      let file = fileStore[uuid].file;
      let filename = file.filename
      filename  = filename.replaceAll(" ", "_")
      

      file.bufferArray[index] = req.file.buffer;
      fileStore[uuid].lastUpdated = new Date();

      console.log(`Receiving: ${filename} [${index} / ${file.chunksTotal}]`)
          
      

    if (file.missingPackets().length == 0){
      console.log("Writing file")


      const concatenatedBuffer = Buffer.concat(file.bufferArray)

     
     // 2 GB limit
     // buffer in ram!
     // write directly to a file
     fs.writeFile(uploadPath+filename, concatenatedBuffer, 'binary', (err) => {if(err)console.log(err)});
     //QmQqfjNidDm6jRVq17FRKoZKZF396gwDrNabFKtpsYQhiH
     //QmTx7c9DANHfEvEXuTNDgpJL1wddSvrDe6iDkweoXnGV1v
     //QmcvMMJ2n6f6i4o9PZqundXUfjytF6Krp69sjJ45K1EHYw
     
   
  let out
  exec(`ipfs add ${uploadPath+filename}`, (error, stdout, stderr) => {
  console.log(error,stdout,stderr)
  out =  stdout
  res.status(200).json({ok: true, key:stdout.split(' ')[1] });
  });
  console.log(out);
  //res.status(200).json({ data:out.toString("utf8") });
    
     
      

    } else{ res.status(200).json({ ok: "chunk" });}
    }

    // if its metadata
    if (req?.body?.data) {
      console.log(req.body.data)
      return
      let data = JSON.parse(req.body.data);
      if (data.type == "metadata") {
        let file = new Myfile(
          data.uuid,
          data.filename,
          data.filesize,
          data.chunks
        );

        fileStore[data.uuid] = {
          added: new Date(),
          lastUpdated: new Date(),
          file,
        };
        res.status(200).json({ ok: "meta" });
      }
      else{
        console.log("unknown1")
      }
    }
    else if(req.body.cid){
      console.log(req.body.cid)
      exec(`ipfs get ${req.body.cid}`, (error, stdout, stderr) => {
        console.log(error,stdout,stderr)
   
        res.status(200).json({ok: true });
        });
    }

   
    //
    //console.log(data);
    //console.log(req.file);

    //console.log(Object.keys(req));

    // req.file.buffer
    //req.file.mimetype
    // req.body.fileId
    //req.body.chunkIndex
    //const fileData = req.file.buffer;
    // const fileContent = fileData.toString('utf-8');
    // console.log(fileContent)
  });
  //res.status(200).json({ ok: "just" });
};
