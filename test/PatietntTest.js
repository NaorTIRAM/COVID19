//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js';
import { examples } from '../classes/examples.js'
let should = chai.should();
chai.use(chaiHttp);

//adding data for testing
server.data_base.people.addPatient(examples.patient1) //adding patient for testing
server.data_base.people.addPotentialPatient(examples.potential, server.data_base.people[server.data_base.people.length-1].patientID)

describe('Patients', () => {
/** Test the /GET route*/
  describe('/GET Patients', () => {
      it('it should GET all the patients', 
      (done) => {
        chai.request(server)
            .get(`/patients`)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
              done();
            });
      });
  });

  describe('/PUT Patient', () => {
    it('it should PUT a new patient', 
    (done) => {
      chai.request(server)
          .put(`/patients`)
          .send(examples.patient2)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('object');
              res.body.should.have.property('patientID');
            done();
          });
    });
  });
});

describe('Labtests', () => {
  /** Test the /GET route*/
  describe('/Post Labtest', () => {
    it('it should Post a new labtest', 
    (done) => {
      chai.request(server)
          .post(`/labtests`)
          .send(examples.labtest)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('object');
              res.body.should.have.property('patientID').and.to.be.a('string');
            done();
          });
    });
  });
});


describe('Routes', () => {
  //addding patient for testing

  /** Test the /Put route*/
  describe('/Put Routes', () => {
    it('it should PUT a new Route', 
    (done) => {
      chai.request(server)
          .put(`/patients/0/route`)
          .send(examples.route)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('object');
            done();
          });
    });
  });

  /** Test the /Get route*/
  describe('/Get Routes', () => {
    it('it should Get a new Route', 
    (done) => {
      chai.request(server)
          .get(`/patients/0/route`)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              res.body[0].should.have.property('dateOfVisit');
              res.body[0].should.have.property('siteName').and.to.be.a('string');
              res.body[0].should.have.property('siteAddress').and.to.be.an('object');
            done();
          });
    });
  });
});

describe('Encounters', () => {
  //addding patient for testing

  /** Test the /Put route*/
  describe('/Put Encounter', () => {
    it('it should PUT a new Encounter', 
    (done) => {
      chai.request(server)
          .put(`/patients/0/encounters`)
          .send(examples.encounter)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('firstName').and.to.be.a('string');
              res.body.should.have.property('lastName').and.to.be.a('string');
              res.body.should.have.property('phoneNumber').and.to.be.a('string');
            done();
          });
    });
  });

  /** Test the /Get route*/
  describe('/Get Encounters', () => {
    it('it should Get all Encounters by patient', 
    (done) => {
      chai.request(server)
          .get(`/patients/0/encounters`)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              res.body[0].should.have.property('potentialPatientDetails').and.to.be.an('object');
              res.body[0].should.have.property('encounteredPatient').and.to.be.an('object');
            done();
          });
    });
  });
});

/** Test the /Get FULL */
describe('/Get FUll details of person with his lab tests', () => {
  it('it should Get all FUll  patient data', 
  (done) => {
    chai.request(server)
        .get(`/patients/0/full`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('isCovidPositive').and.to.be.a('boolean');
            res.body.should.have.property('labResults').and.to.be.an('array');
          done();
        });
  });
});

/** Test the /Get Since */
describe('/Get LIST OF ALL SICK PEOPLE', () => {
  it('it should LIST OF ALL SICK PEOPLE SINCE A CERTAIN TIME', 
  (done) => {
    chai.request(server)
        .get(`/patients/new?since=2022-02-25T11:34:10Z`)
        .end((err, res) => {
            res.should.have.status(200);
                res.body.should.be.an('array');
          done();
        });
  });
});

/** Test the /Potential */
describe('/Potential', () => {
  it('it should return the list of encounters where the person details were not inserted yet', 
  (done) => {
    chai.request(server)
        .get(`/patients/potential`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array');
          done();
        });
  });
});

describe('/Isolated', () => {
  it('it should return the list of all isolated people', 
  (done) => {
    chai.request(server)
        .get(`/patients/potential`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array');
          done();
        });
  });
});

/** Test the POST /Potential */
describe('/Potential', () => {
  it('it should move the potential to be a patient', 
  (done) => {
    chai.request(server)
        .post(`/patients/potential/1`)
        .send(examples.patient3)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('patientID').and.to.be.an('string');
          done();
        });
  });
});

/** Test the get /statistics */
describe('/Statistics', () => {
  it('it should get all the statistics', 
  (done) => {
    chai.request(server)
        .get(`/statistics`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('infected').and.to.be.an('number');
            res.body.should.have.property('healed').and.to.be.an('number');
            res.body.should.have.property('isolated').and.to.be.an('number');
            res.body.should.have.property('cityStatistics').and.to.be.an('array');
          done();
        });
  });
});