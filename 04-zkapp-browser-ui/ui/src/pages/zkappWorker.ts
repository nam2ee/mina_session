import { Mina, PublicKey, fetchAccount, Field, Poseidon } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { game } from '../../../contracts/src/lotto';

const state = {
  game: null as null | typeof game,
  zkapp: null as null | game,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async (args: {}) => {
    const Network = Mina.Network(
      'https://api.minascan.io/node/devnet/v1/graphql'
    );
    console.log('Devnet network instance configured.');
    Mina.setActiveInstance(Network);
  },
  loadContract: async (args: {}) => {
    const { game } = await import('../../../contracts/build/src/lotto.js');
    state.game = game;
  },
  compileContract: async (args: {}) => {
    await state.game!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.game!(publicKey);
  },
  getCounter: async (args: {}) => {
    const currentCounter = await state.zkapp!.counter.get();
    return JSON.stringify(currentCounter.toJSON());
  },
  getAnswer: async (args: {}) => {
    const currentAnswer = await state.zkapp!.answer.get();
    return JSON.stringify(currentAnswer.toJSON());
  },
  createSetAnswerTransaction: async (args: { answer: number }) => {
    const transaction = await Mina.transaction(async () => {
      await state.zkapp!.setAnswer(Field(args.answer));
    });
    state.transaction = transaction;
  },
  createGuessTransaction: async (args: { guess: number }) => {
    const transaction = await Mina.transaction(async () => {
      await state.zkapp!.guess(Field(args.guess));
    });
    state.transaction = transaction;
  },
  proveTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');
