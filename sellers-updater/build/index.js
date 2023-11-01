"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const sellers_1 = require("./sellers");
const yaml_1 = __importDefault(require("yaml"));
const path_1 = __importDefault(require("path"));
const nodegit_1 = __importDefault(require("nodegit"));
function processData() {
    return __awaiter(this, void 0, void 0, function* () {
        let directoryName = "../../data";
        let fileName = "seller.yml";
        const output = yield new Promise((resolve) => {
            setTimeout(() => {
                resolve(sellers_1.data);
            }, 100);
        });
        output.sellers = [
            ...output.sellers,
            {
                title: "pasha",
                image_url: "https://res.cloudinary.com/copt/image/upload/v1639652148/f_auto,fl_lossy,q_auto/items/suqzox29gqv6jwilx4xj.jpg",
                url: "https://staging.copt.io/pasha",
            },
        ];
        const doc = yaml_1.default.stringify(output);
        fs_1.default.writeFileSync(path_1.default.join(__dirname, directoryName, fileName), doc);
        const pathToRepo = path_1.default.resolve("../");
        let index;
        let repo;
        let oid;
        let remote;
        nodegit_1.default.Repository.open(pathToRepo)
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
            return nodegit_1.default.Reference.nameToId(repo, "HEAD");
        })
            .then((head) => {
            return repo.getCommit(head);
        })
            .then((parent) => {
            var author = nodegit_1.default.Signature.create("Pavel", "pavel@copt.io", 123456789, 60);
            var committer = nodegit_1.default.Signature.create("Pavel", "pavel@copt.io", 987654321, 90);
            return repo.createCommit("HEAD", author, committer, "updated sellers", oid, [parent]);
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
    });
}
processData();
