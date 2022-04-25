const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const { app: server } = require('../server');
const Issue = require('../db').Issue;

const PATH = process.env.TEST_PATH || '/api/issues/test';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  var tempIssue;

  suite('POST /api/issues/${project}', () => {
    test('Create a issue with all fields filled', (done) => {
      const issue = new Issue({
        issue_title: 'Test issue',
        issue_text: 'Test issue text',
        created_by: 'kibar',
        assigned_to: 'Test user',
        status_text: 'Test status',
        open: true,
      })._doc;

      chai
        .request(server)
        .post(PATH)
        .send({ ...issue })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, issue.issue_title);
          assert.equal(res.body.issue_text, issue.issue_text);
          assert.equal(res.body.created_by, issue.created_by);
          assert.equal(res.body.assigned_to, issue.assigned_to);
          assert.equal(res.body.status_text, issue.status_text);
          assert.equal(res.body.open, issue.open);
          tempIssue = res.body;
          done();
        });
    });

    test('Create a issue with required fields filled', (done) => {
      const issue = new Issue({
        issue_title: 'Test issue',
        issue_text: 'Test issue text',
        created_by: 'kibar',
      })._doc;

      chai
        .request(server)
        .post(PATH)
        .send({ ...issue })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, issue.issue_title);
          assert.equal(res.body.issue_text, issue.issue_text);
          assert.equal(res.body.created_by, issue.created_by);
          done();
        });
    });

    test('Create a issue with missing required fields', (done) => {
      const issue = new Issue({
        issue_title: '',
        issue_text: '',
        created_by: '',
      })._doc;

      chai
        .request(server)
        .post(PATH)
        .send({ ...issue })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('GET /api/issues/${project}', () => {
    test('Get issues without filter', (done) => {
      chai
        .request(server)
        .get(PATH)
        .query({})
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
    });

    test('Get issues with one filter', (done) => {
      chai
        .request(server)
        .get(PATH)
        .query({ created_by: 'kibar' })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, 'kibar');
          done();
        });
    });

    test('Get issues with multiple filter', (done) => {
      chai
        .request(server)
        .get(PATH)
        .query({
          issue_title: 'Test issue',
          issue_text: 'Test issue text',
          created_by: 'kibar',
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_title, 'Test issue');
          assert.equal(res.body[0].issue_text, 'Test issue text');
          assert.equal(res.body[0].created_by, 'kibar');
          done();
        });
    });
  });

  suite('PUT /api/issues/${project}', () => {
    test('Update one field on an issue', (done) => {
      chai
        .request(server)
        .put(PATH)
        .send({
          _id: tempIssue._id,
          issue_title: 'My Awesome New Title',
        })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body._id, tempIssue._id);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });

    test('Update multiple fields on an issue', (done) => {
      chai
        .request(server)
        .put(PATH)
        .send({
          _id: tempIssue._id,
          issue_title: 'My Awesome New Title',
          issue_text: 'My Awesome New Text',
        })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body._id, tempIssue._id);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });

    test('Update an issue with missing id', (done) => {
      chai
        .request(server)
        .put(PATH)
        .send({
          issue_title: 'My Awesome New Title',
          issue_text: 'My Awesome New Text',
        })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    test('Update an issue with no fields', (done) => {
      chai
        .request(server)
        .put(PATH)
        .send({ _id: tempIssue._id })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        });
    });

    test('Update an issue with an invalid id', (done) => {
      chai
        .request(server)
        .put(PATH)
        .send({
          _id: 'mustafa@kibar.pro',
          issue_title: 'My Awesome New Title',
        })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });
  });

  suite('DELETE /api/issues/${project}', () => {
    test('Delete an issue', (done) => {
      chai
        .request(server)
        .delete(PATH)
        .send({ _id: tempIssue._id })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
    });

    test('Delete an issue with an invalid id', (done) => {
      chai
        .request(server)
        .delete(PATH)
        .send({ _id: 'mustafa@kibar.pro' })
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          done();
        });
    });

    test('Delete an issue with missing id', (done) => {
      chai
        .request(server)
        .delete(PATH)
        .send()
        .end(function (err, res) {
          if (err) return console.error(err);

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
