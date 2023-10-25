"use client";
//const { uuid } = require("uuidv4");
import DefaultLayout from "@/layouts/default";
const uuid = require("uuid");
import axios from "axios";
import React, {useState} from "react";
import {Card,Spacer,Row, Container, Text, Input, Textarea, Button} from "@nextui-org/react";



export default function PrivatePage(props) {
  const [buttonText, setButtonText] = useState("");
  const [formData, setFormData] = useState({ CID: '' });



  const chunkSize = 1024 * 512; // 1MB
  const chunks = [];
  let fileMeta = [];
  let fileUUID;
  let offset = 0;

  const uploadToClient = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file.name, " ", file.size);

      fileUUID = uuid.v1();
      fileMeta[fileUUID] = {};

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
      }
      fileMeta[fileUUID].type = "metadata";
      fileMeta[fileUUID].uuid = fileUUID;
      fileMeta[fileUUID].filename = file.name;
      fileMeta[fileUUID].filesize = file.size;
      fileMeta[fileUUID].chunks = chunks.length;

      const endpoint = `/api/upload`;

      let fileMeta_str = JSON.stringify(fileMeta[fileUUID]);

      const body = new FormData();
      body.append("data", fileMeta_str);

      let response = await axios.post(endpoint, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    

      for (let i = 0; i < chunks.length; i++) {
        const body = new FormData();

        body.append("chunk", chunks[i]);
        body.append("chunkIndex", i);
        body.append("fileId", fileUUID);

        let response = await   axios.post(endpoint, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setButtonText(response.data.key);
        console.log(response.data.key)
      }

     

      const b = new FormData();
      fileMeta[fileUUID].type = "end";
      fileMeta_str  = JSON.stringify(fileMeta[fileUUID]);
      b.append("data", fileMeta_str);

      let resp = await axios.post(endpoint, {body:b}, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
   
    }
  };

  
  return (
    <DefaultLayout>
      <section className="flex text-center justify-center  gap-1  py-10">
          <div 
        className=" text-center justify-center " >
        <input
          type="file"
          name="file"
          encType="multipart/form-data"
          onChange={uploadToClient}
        />
      </div>
      </section>
      </DefaultLayout>
  );
  
}
