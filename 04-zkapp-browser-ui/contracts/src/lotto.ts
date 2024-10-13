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
import { p } from 'o1js/dist/node/bindings/crypto/finite-field';
import { add } from 'o1js/dist/node/lib/provable/gadgets/native-curve';

let answer = 10;
let hash : Field= Poseidon.hash(Field.from(answer).toFields());



export class game extends SmartContract{
  @state(Field) counter = State<Field>(Field.from(0));
  @state(Field) answer = State<Field>(Field.from(0));

    @method async setAnswer(setting: Field){
      
      let counter = this.counter.get();
      this.counter.requireEquals(counter);
      counter.assertEquals(Field.from(0));
      // if fied is not 0, it will throw an error

      const answerHash = Poseidon.hash([Field(100), setting]);

      let answer = this.answer.get();
      this.answer.requireEquals(answer);
      this.answer.set(answerHash);
      //console.log(answerHash);
      this.counter.set(Field(1));
    
    }

    

    @method async guess(guess: Field){

     
      const guessHash = Poseidon.hash([Field(100), guess]);

      const answer = this.answer.get();
      this.answer.requireEquals(answer);
      //when you access state variables, 
      //you need to explicitly declare that 
      //you're using the current on-chain state.

      guessHash.assertEquals(answer);
      console.log("정답입니다!");
    }


 

    }


 






const zkapp = ZkProgram({
  name: 'game',
  publicInput: Field,

  methods:{
    setAnswer: {
      privateInputs: [Field],
      async method( hash: Field, answer: Field){ //hash: Poseidon.hash([Field(100), answer])
        hash.assertEquals(Poseidon.hash([Field(100), answer]));
      }
    },
    guess: {
      privateInputs: [SelfProof<Field, void>],
      async method(guess: Field, problem: SelfProof<Field, void>){
        
        let challenge = Poseidon.hash([Field(100), guess]);
        challenge.assertEquals(problem.publicInput);
      }
    }
  }
}
)



