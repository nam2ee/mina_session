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
    Scalar,
    
  } from 'o1js';


  // 주어진 서명 구조체
  let signatureData = {
    "signature": {
      "field": "17642012515138362059855729805765024923048616930127428770083445215657314176254",
      "scalar": "15443807341125269250315188261419240129271505974440093489883267521180724058637",
    },
    "publicKey": "B62qn4SYiBmB9Ly8aHN3asfzdDrKhCNekiisNc8D5VBNwtJ6a8Fqy8P",
    "data": "1222"
  }
  
  let r1 = BigInt(signatureData.signature.field)
  let s1 = BigInt(signatureData.signature.scalar)
  // 서명 생성

  let r = Scalar.from(r1)
  let s = Scalar.from(s1)


  let signature = new Signature(r, s);
  
  // 공개키 (예시, 실제 공개키로 대체해야 함)
  let publicKey = PublicKey.fromBase58("B62qn4SYiBmB9Ly8aHN3asfzdDrKhCNekiisNc8D5VBNwtJ6a8Fqy8P");

  console.log("pub", publicKey.toBase58());
  
  // 서명 검증
  let isValid = signature.verify(publicKey, [Field.from(1222)]);
  
  console.log("Signature is valid:", isValid);
  