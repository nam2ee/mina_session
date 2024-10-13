import {
    Field,
    SelfProof,
    Struct,
    MerkleMap,
    MerkleWitness,
    MerkleMapWitness,
    verify,
    Poseidon,
    SmartContract,
    state,
    State,
    method,
    DeployArgs,
    Proof,
    Permissions,
    ZkProgram,
    TransactionVersion,
    UInt64,
    PublicKey,
    Account,
    PrivateKey,
    CircuitString,
    Signature,
  } from 'o1js';



 let a = Field.from("13468724101429370746602596170094552502200193721398063751467629418902449650534");
let b= Field.from(13468724101429370746602596170094552502200193721398063751467629418902449650534); 


a.assertEquals(b);