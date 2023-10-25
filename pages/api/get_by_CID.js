import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../api/session/session_config";

const {
  spawn,
  exec,
  execFile,
  fork,
  execSync,
  spawnSync,
} = require("child_process");

export default withIronSessionApiRoute(get_by_CID, ironOptions);
let history = [];
let download_path = `${process.cwd()}/public/ipfs/`;
async function get_by_CID(req, res) {
  let response = "";
  exec(
    `ipfs get ${req.body.cid} -o ${download_path}${req.body.cid}`,
    (error, stdout, stderr) => {
      if (stdout) {
        let out = stdout.split(" ");
        response = out[0] + out[1];
        history.push({ cid: req.body.cid, date: new Date(), resolved: true });
        req.session.history = [...new Set(history)];
        req.session.save();
        //console.log(req.session.history);
        res
          .status(200)
          .json({ ok: true, status: "done", session: req.session });
      }
      console.log(stdout.split(" ")[0]);
      console.log(stderr);
    }
  );

  //res.status(200).json({ data:out.toString("utf8") });
}
