import DefaultLayout from "@/layouts/default";
import { ironOptions } from "./api/session/session_Config";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";

const uuid = require("uuid");
import axios from "axios";
import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";

export default function IndexPage({ session_prop }) {
  const router = useRouter();
  let session = JSON.parse(session_prop);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let endpoint = "/api/get_by_CID";
    let data = { cid: e.target[0].value };

    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // update local session history
    session.history = response.data.session.history;

    if (response.data.status) {
      router.push(`/ipfs/${e.target[0].value}`);
    }
    console.log(response.data.status);
  };

  return (
    <DefaultLayout>
      <section className="flex text-center justify-center  gap-1  py-10">
        <div style={{ width: "50%" }} className=" text-center justify-center ">
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              isClearable="true"
              placeholder="Please Enter CID"
            />
            <button type="submit" className=" justify-center  gap-1  md:py-5">
              Submit
            </button>
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
}
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    return {
      props: {
        session_prop: JSON.stringify(req.session),
      },
    };
  },
  ironOptions
);
