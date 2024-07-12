import mongoose, { Schema } from 'mongoose';

const repoSchema = new Schema({
  githubId: {
    type: Number,
    required: [true, 'Id is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  url: {
    type: String,
    required: [true, 'Url is required'],
  },
  branches: {
    type: Number,
    required: [true, 'Number of branches is required'],
  },
  branchesList: {
    type: Array,
    required: true,
  },
  language: {
    type: String,
    required: [true, 'Programming Language is required'],
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

export const RepoModel = mongoose.model('Repo', repoSchema);
