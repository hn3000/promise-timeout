
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mocha from 'mocha';
import { timeoutPromise } from '../src/index';

let neverPromise = new Promise((rs,rj) => {});

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
      .then(() => chai.expect(Date.now()+1).to.be.greaterThan(start+100).and.lessThan(start+110));
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
      .then(() => chai.expect(Date.now()+1).to.be.greaterThan(start+100).and.lessThan(start+110));
  });
  it("times out to fallback", () => {
    return chai.expect(timeoutPromise(neverPromise, 100, '#fallback#')).to.eventually.be.equal('#fallback#');
  });
  it("returns the first available value", () => (
    chai.expect(timeoutPromise(Promise.resolve('first'), 100, 'fallback')).to.eventually.be.equal('first')
  ));
});

