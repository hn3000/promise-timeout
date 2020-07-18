
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mocha from 'mocha';
import { timeoutPromise, resolveAfter, rejectAfter } from '../src/index';

let neverPromise = new Promise((_rs,_rj) => {});

chai.use(chaiAsPromised);

mocha.describe('unit testing', () => {
  it("works for promises", () => chai.expect(Promise.resolve(13)).to.eventually.be.a('number').equal(13));
  it("finds neverPromise to be Promise", () => chai.expect(neverPromise).to.be.instanceOf(Promise));
});

mocha.describe('timeout without fallback', async () => {
  it("times out after the expected time", () => {
    const start = Date.now();
    return chai.expect(timeoutPromise(neverPromise, 100))
      .to.eventually.be.rejectedWith(Error)
      .then(() => chai.expect(Date.now()+1).to.be.gte(start+100).and.lte(start+110));
  });
  it("times out to rejection", () => {
    return chai.expect(timeoutPromise(neverPromise, 100)).to.eventually.be.rejectedWith(Error);
  });
  it("returns the value if it does not time out", () => (
    chai.expect(timeoutPromise(timeoutPromise(neverPromise, 10, 'first'), 100)).to.eventually.be.equal('first')
  ));
});

mocha.describe('timeout with fallback', async () => {
  it("finds neverPromise to be Promise", () => chai.expect(neverPromise).to.be.instanceOf(Promise));
  it("times out after the expected time", () => {
    const start = Date.now();
    return chai.expect(timeoutPromise(neverPromise, 100, {}))
      .to.eventually.be.an('object')
      .then(() => chai.expect(Date.now()+1).to.be.gte(start+100).and.lte(start+110));
  });
  it("times out to fallback", () => {
    return chai.expect(timeoutPromise(neverPromise, 100, '#fallback#')).to.eventually.be.equal('#fallback#');
  });
  it("returns the first available value", () => (
    chai.expect(timeoutPromise(Promise.resolve('first'), 100, 'fallback')).to.eventually.be.equal('first')
  ));
});

mocha.describe('resolveAfter', async () => {
  it("resolves after the expected time", () => {
    const start = Date.now();
    return chai.expect(resolveAfter(100, {}))
      .to.eventually.be.an('object')
      .then(() => chai.expect(Date.now()+1).to.be.gte(start+100).and.lte(start+110));
  });
  it("resolves to undefined without arg", () => {
    const start = Date.now();
    return chai.expect(resolveAfter(100))
      .to.eventually.be.an('undefined')
      .then(() => chai.expect(Date.now()+1).to.be.gte(start+100).and.lte(start+110));
  });
});

mocha.describe('rejectAfter', async () => {
  it("rejects after the expected time", () => {
    const start = Date.now();
    return chai.expect(rejectAfter(100, new Error('I am very very disappointed.')))
      .to.eventually.be.rejectedWith(Error)
      .then(() => chai.expect(Date.now()+1).to.be.gte(start+100).and.lte(start+110));
  });
  it("rejects to undefined without arg", () => {
    const start = Date.now();
    return chai.expect(rejectAfter(100))
      .to.eventually.be.rejectedWith(undefined)
      .then(() => chai.expect(Date.now()+1).to.be.gte(start+100).and.lte(start+110));
  });
});

