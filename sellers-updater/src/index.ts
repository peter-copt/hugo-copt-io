import fs from "fs";
import YAML from "yaml";
import path from "path";
import axios from "axios";
import "dotenv/config";
import NodeGit from "nodegit";
import { getPersonalShopFullUrl } from "./utils";

const agentInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 40000,
});

(async () => {
  const repo = await NodeGit.Repository.open(
    path.resolve(__dirname, "../../.git")
  );
  let directoryName = "data";
  let fileName = "seller.yml";

  const sellers = await agentInstance.get(`Profiles/hasSellingLastWeek`, {
    headers: { Authorization: `Bearer ${process.env.JWT}` },
  });

  const data = sellers.data.map((x: any) => {
    return {
      title: x.name,
      image_url: x.img?.replace("/items", "/f_auto,fl_lossy,q_auto/items"),
      url: getPersonalShopFullUrl(x.name),
    };
  });
  console.log(data);

  const doc = YAML.stringify({ sellers: [...data] });
  await fs.promises.mkdir(path.join(repo.workdir(), directoryName), {
    recursive: true,
  });

  await fs.promises.writeFile(
    path.join(repo.workdir(), directoryName, fileName),
    doc
  );

  const index = await repo.refreshIndex();

  await index.addByPath(path.posix.join(directoryName, fileName));
  await index.write();

  const oid = await index.writeTree();

  const parent = await repo.getHeadCommit();
  const author = NodeGit.Signature.now("Pavel Mironov", "pavel@copt.io");
  const committer = NodeGit.Signature.now("Pavel Mironov", "pavel@copt.io");

  const commitId = await repo.createCommit(
    "HEAD",
    author,
    committer,
    "update sellers via app",
    oid,
    [parent]
  );

  const remote = await NodeGit.Remote.lookup(repo, "origin");

  const publickey = fs
    .readFileSync(path.resolve(__dirname, "../keys/id_ed25519"))
    .toString();
  const privatekey = fs
    .readFileSync(path.resolve(__dirname, "../keys/id_ed25519.pub"))
    .toString();
  const passphrase = "copthype";
  try {
    const pushResult = await remote.push(
      ["refs/heads/hugo-new:refs/heads/hugo-new"],
      {
        callbacks: {
          credentials: function (url: any, userName: any) {
            return NodeGit.Credential.sshKeyMemoryNew(
              userName,
              publickey,
              privatekey,
              passphrase
            );
          },
        },
      }
    );
  } catch (err) {
    console.error(err);
  }

  // console.log(`Done: ${pushResult}`);
})();
