const mongoose = require('mongoose');
const { Schema } = mongoose;

var db;
const connect = async () => {
  try {
    db = await mongoose.connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB connected');
  } catch (err) {
    console.log('Failed to connect to DB', err);
  }
};

const IssueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: Date,
  updated_on: Date,
  assigned_to: String,
  status_text: String,
  open: Boolean,
});

const Issue = mongoose.model('Issues', IssueSchema);

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  issues: [IssueSchema],
});

const Project = mongoose.model('Projects', ProjectSchema);

module.exports = { connect, Issue, Project, db };
