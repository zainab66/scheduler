import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,

} from "@testing-library/react";import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Max Wong"}
    })
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(container, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Max Wong"));
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });



  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const {container} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Max Wong" }
    })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // console.log(prettyDOM(appointment));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Max Wong"));
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });
  
  it("shows the save error when failing to save an appointment", async () => {
    const { container} = render(<Application />);

    await waitForElement(() => getByText(container,"Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    const input = getByPlaceholderText( appointment,/enter student name/i);
    fireEvent.change(input, {target: {value: "Lydia Miller-Jones"}});
    axios.put.mockRejectedValueOnce();

    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment,/saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Could not save the appointment"));
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(queryByText(appointment,"Archie Cohen")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,/1 spot remaining/i)).toBeInTheDocument();
    

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container,"Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    axios.delete.mockRejectedValueOnce();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment,/deleting/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Could not cancel the appointment."));
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(queryByText(appointment,"Archie Cohen")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day,/1 spot remaining/i)).toBeInTheDocument();
    
  });

})