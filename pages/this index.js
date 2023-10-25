"use client";
//const { uuid } = require("uuidv4");

const uuid = require("uuid");
import axios from "axios";
import React, { useState } from "react";
import {
   Button,
} from "@nextui-org/react";

export default function PrivatePage(props) {
  const [buttonText, setButtonText] = useState("");
  const [formData, setFormData] = useState({ CID: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data Submitted:", formData);
    const endpoint = `/api/upload`;

    const body = new FormData();
    body.append("cid", formData.CID);

    let response = await axios.post(endpoint, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);

    // const r = await fetch(endpoint, options);
    // const result = await response.json();
  };

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

      //console.log(Object.keys(fileMeta));

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

        let response = await axios.post(endpoint, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setButtonText(response.data.key);
        console.log(response.data.key);
      }

      const b = new FormData();
      fileMeta[fileUUID].type = "end";
      fileMeta_str = JSON.stringify(fileMeta[fileUUID]);
      b.append("data", fileMeta_str);

      let resp = await axios.post(
        endpoint,
        { body: b },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        encType="multipart/form-data"
        onChange={uploadToClient}
      />

      <Button color="primary">{buttonText}</Button>

      <form onSubmit={handleSubmit}>
        <label>
          CID
          <input
            type="text"
            name="CID"
            value={formData.cid}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
