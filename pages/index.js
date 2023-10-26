import DefaultLayout from "@/layouts/default";
import { ironOptions } from "./api/session/session_config";
import { withIronSessionSsr } from "iron-session/next";

import { useRouter } from "next/router";

const uuid = require("uuid");
import axios from "axios";
import React, { useState } from "react";
import { Button, Input, Textarea, Card, Text } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import Grid from "@mui/material/Grid";

export default function IndexPage({ session_prop }) {
  const router = useRouter();
  let session = JSON.parse(session_prop);
  let pos = session.init.pos;
  let lexicon = session.init.lexicon;
  let rules = session.init.rules;

  const [output, setOutput] = React.useState("Output");
  const [posBorder, setPosBorder] = React.useState(false);

  async function init() {}
  const handleSubmit = async (e) => {
    //init();
    e.preventDefault();
  };

  const columns = [
    {
      key: "word",
      label: "WORD",
    },
    {
      key: "root",
      label: "ROOT",
    },
    {
      key: "POS",
      label: "POS",
    },
    {
      key: "number",
      label: "NUMBER",
    },
  ];

  async function parse(e) {
    let text = e.target.value.trim();
    let endpoint = "http://localhost:3000/api/main";
    let data = { type: "parse", text };

    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let out = response.data.data;

    let output = out.text;
    
    if (text == "") {
      setPosBorder(false);
    } else {
      setPosBorder(!out.isDictionary);
    }
  
    setOutput(output.join(" "));
  }

  return (
    <DefaultLayout>
      <Grid gap={2} container wrap="nowrap" className=" mt-10 ">
        <Grid xs={3} item={true}>
          <Grid>
            <section className=" justify-right text-center ">
              <Textarea
                isReadOnly
                isInvalid={posBorder}
                label="Parts Of Speach"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                defaultValue={pos.join("   ")}
                className="max-w-xs"
              />
            </section>
          </Grid>
          <Grid>
            <section className=" justify-right text-center ">
              <Textarea
                isReadOnly
                label="Rules"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                defaultValue={rules.join("\n")}
                className="max-w-xs"
              />
            </section>
          </Grid>
        </Grid>

        <Grid xs={6} item={true}>
          {" "}
          <section className=" justify-right text-center">
            <form onSubmit={handleSubmit}>
              <Input
                onChange={parse}
                type="text"
                isClearable="true"
                placeholder="Please Enter Phrase"
              />
              <button type="submit">Submit</button>
            </form>
          </section>
          <section className=" justify-right text-center ">
            <Textarea
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your description"
              value={output}
              className=" mt-10 "
            />
          </section>
        </Grid>
        <Grid xs={3} item={true}>
          <section className=" justify-right text-center ">
            <Table aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={lexicon}>
                {(item) => (
                  <TableRow key={item.word}>
                    {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </section>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
}
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    let endpoint = "http://localhost:3000/api/main";
    let data = { type: "init" };

    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    req.session.init = response.data.data;
    return {
      props: {
        session_prop: JSON.stringify(req.session),
      },
    };
  },
  ironOptions
);
