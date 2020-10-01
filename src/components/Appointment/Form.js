import React from 'react';

import InterviewerList from '../InterviewerList';
import Button from '../Button';
import { action } from '@storybook/addon-actions/dist/preview';



export default function Form(props) {

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={props.name}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={props.interviewer} onChange={action("setInterviewer")} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={props.onCancel} >Cancel</Button>
          <Button confirm onClick={props.onSave} >Save</Button>
        </section>
      </section>
    </main>
  )
} 