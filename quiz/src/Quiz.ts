import { Field, SmartContract, state, State, method, Bool, Poseidon } from 'o1js';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Quiz extends SmartContract {
  @state(Field) target = State<Field>();
  @state(Field) salt = State<Field>();
  @state(Bool) private flag = State<Bool>(); 

  init() {
    super.init();
    this.flag.set(Bool.fromValue(false));
  }

  @method async setup(salt : Field, seed: Field){
    let origin = await this.target.get();
    this.target.requireEquals(origin); // 쓸 데는 없음 

    let flag = await this.flag.get();
    this.flag.requireEquals(flag);

    flag.assertEquals(Bool.fromValue(false));

    this.salt.set(salt);
    
    let setup = Poseidon.hash([salt, seed]);
    this.target.set(setup);

    this.flag.set(Bool.fromValue(true)); 
  }

  @method async guess( answer: Field) {
    let flag = await this.flag.get();
    this.flag.requireEquals(flag);

    let salt = await this.salt.get();
    this.salt.requireEquals(salt);

    let target = await this.target.get();
    this.target.requireEquals(target);


    flag.assertEquals(Bool.fromValue(true));
    let answer_ = Poseidon.hash([salt, answer]);

    target.assertEquals(answer_);

  }
}
