import dora from 'dora';
import { join } from 'path';
import request from 'supertest';

const port = '12345';

describe('debug-corner', () => {

  before(done => {
    dora({
      port,
      plugins: [`../../../src/index`],
      cwd: join(__dirname, './fixtures/normal'),
    });
    setTimeout(done, 1000);
  });

  it('GET /dora-plugin-debug-corner.js', done => {
    request(`http://localhost:${port}`)
      .get('/dora-plugin-debug-corner.js')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        if (res.text !== 'console.log(1);') throw new Error("dora-plugin-debug-corner.js is not correct"); 
        done();
      });
  });
});

