import fs from "fs";
import { Data, data } from "./sellers";
import YAML from "yaml";
import path from "path";
import promisify from "promisify-node";
import fs_extra from "fs-extra";

import NodeGit from "nodegit";

async function processData() {
  let directoryName = "../../data";
  let fileName = "seller.yml";
  const output: Data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });

  output.sellers = [
    ...output.sellers,
    {
      title: "pasha",
      image_url:
        "https://res.cloudinary.com/copt/image/upload/v1639652148/f_auto,fl_lossy,q_auto/items/suqzox29gqv6jwilx4xj.jpg",
      url: "https://staging.copt.io/pasha",
    },
  ];

  const doc = YAML.stringify(output);
  fs.writeFileSync(path.join(__dirname, directoryName, fileName), doc);

  const pathToRepo = path.resolve("../");

  let index: any;
  let repo: any;
  let oid: any;
  let remote: any;

  NodeGit.Repository.open(pathToRepo)
    .then(function (repoResult) {
      repo = repoResult;
      return repoResult;
      // const dir = fse.ensureDir(path.join(repo.workdir(), directoryName));
      // console.log(dir);
      // return dir;
    })
    .then((repo) => {
      return repo.refreshIndex();
    })
    .then(function (indexResult) {
      index = indexResult;
    })
    .then(function () {
      return index
        .addByPath(directoryName, fileName)
        .then(() => {
          return index.write();
        })
        .then(() => {
          return index.writeTree();
        });
    })
    .then((oidResult) => {
      oid = oidResult;
      return NodeGit.Reference.nameToId(repo, "HEAD");
    })
    .then((head) => {
      return repo.getCommit(head);
    })
    .then((parent) => {
      var author = NodeGit.Signature.create(
        "Pavel",
        "pavel@copt.io",
        123456789,
        60
      );
      var committer = NodeGit.Signature.create(
        "Pavel",
        "pavel@copt.io",
        987654321,
        90
      );
      return repo.createCommit(
        "HEAD",
        author,
        committer,
        "updated sellers",
        oid,
        [parent]
      );
    })
    .then((commitId) => {
      return repo.getRemote("origin");
    })
    .then((remote) => {
      // return remote.push(["refs/heads/hugo-new:refs/heads/hugo-new"], {
      //   callbacks: () => false,
      // });
    })
    .catch((err) => {
      console.log(err);
    });
}

processData();
