import DefaultLayout from "@/layouts/default";
import { ironOptions } from "./api/session/session_config";
import { withIronSessionSsr } from "iron-session/next";

import { useRouter } from "next/router";
import TreeChart from "./trent";

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
import { rule } from "postcss";

export default function IndexPage({ session_prop }) {
  const router = useRouter();
  let session = JSON.parse(session_prop);
  let pos = session.init.pos;
  let lexicon = session.init.lexicon;
  let rules = session.init.rules;

  const [output, setOutput] = React.useState("Output");
  const [posBorder_POS, setPosBorder_POS] = React.useState(false);
  const [trent_data, setTrent_data] = React.useState(null);
  const [suggestion_hook, setSuggestion_hook] = React.useState(...[]);

  const columns_dict = [
    {
      key: "name",
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
  const columns_rules = [
    {
      key: "start",
      label: "Start",
    },
    {
      key: "opt1",
      label: "Opt1",
    },
    {
      key: "opt2",
      label: "Opt2",
    },
  ];

  async function parse(e) {
    let text = e.target.value.trim();
    let endpoint = "./api/main";
    let data = { type: "parse", text };

    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let out = response.data.data;
    console.log(out);

    let output = out.text;
    let tr_data = out.trent_data;

    setPosBorder_POS(!out.isValid);

    setTrent_data(tr_data);

    output = out.err_msg == "" ? output : out.err_msg;
    setOutput(output);
  }

  function t() {
    // Render the children here
    return <TreeChart children={trent_data} />;
  }

  return (
    <DefaultLayout>
      {/* MAIN Grid  */}
      <Grid gap={2} container wrap="nowrap" className=" mt-10 ">
        {/* Left column  */}
        <Grid xs={3} item={true}>
          {/* Left column RULES  */}
          <Grid>
            <section className=" justify-right text-center "></section>
            <Table aria-label="Example table with dynamic content">
              <TableHeader columns={columns_rules}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={rules}>
                {(item) => (
                  <TableRow key={item.start}>
                    {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
          {/* Left column  POS  */}
          <Grid>
            <section className=" justify-right text-center ">
              <Textarea
                isReadOnly
                label="Parts Of Speach"
                variant="bordered"
                labelPlacement="outside"
                defaultValue={pos.join("   ")}
                className="max-w-xs"
              />
            </section>
          </Grid>
        </Grid>
        {/* Center column  */}
        <Grid xs={6} item={true}>
          {/*Center column INPUT*/}
          <Grid>
            <section className=" justify-right text-center">
              <Input
                onChange={parse}
                type="text"
                isClearable="true"
                placeholder="Please Enter Phrase"
              />
            </section>
          </Grid>

          {/*Center column OUTPUT*/}
          <Grid>
            <section className=" justify-right text-center ">
              <Textarea
                isInvalid={posBorder_POS}
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                value={output}
              />
            </section>
          </Grid>
          {/*Center column TREE*/}
          <Grid className="  h-full">
            <section className="  h-full">{t()}</section>
          </Grid>
        </Grid>
        {/* Right column MAIN*/}
        <Grid xs={3} item={true}>
          {/* Right column  DICTIONARY*/}
          <Grid>
            <section className=" justify-right text-center ">
              <Table aria-label=" table with dynamic content">
                <TableHeader columns={columns_dict}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={lexicon}>
                  {(item) => (
                    <TableRow key={item.name}>
                      {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section>
          </Grid>
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
