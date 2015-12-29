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

  it('GET /index.html is injected the script dora-plugin-debug-corner.js', done => {
    request(`http://localhost:${port}`)
      .get('/index.html')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        if (res.text.indexOf('<script src="./dora-plugin-debug-corner.js"></script>') < 0) throw new Error("dora-plugin-debug-corner.js is not injected"); 
        done();
      });
  });

  it('GET /lackdoctype.html is injected the script dora-plugin-debug-corner.js', done => {
    request(`http://localhost:${port}`)
      .get('/lackdoctype.html')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        if (res.text.indexOf('<script src="./dora-plugin-debug-corner.js"></script>') < 0) throw new Error("dora-plugin-debug-corner.js is not injected"); 
        done();
      });
  });

  it('GET /index.js should not be handled', done => {
    request(`http://localhost:${port}`)
      .get('/index.js')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        if (res.text.indexOf('console.log(2);') < 0) throw new Error("other types of files should not be handled"); 
        done();
      });
  });
});

