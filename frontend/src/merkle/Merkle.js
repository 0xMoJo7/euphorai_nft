import { whitelist } from "./whitelist";

const { MerkleTree } = require("merkletreejs");
const SHA256 = require("crypto-js/sha256");

const Merkle = (address) => {
  const leaves = whitelist.map((x) => SHA256(x.toLowerCase()));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  const leaf = SHA256(address);
  const proof = tree.getProof(leaf);
  return tree.verify(proof, leaf, root);
};

export { Merkle };
