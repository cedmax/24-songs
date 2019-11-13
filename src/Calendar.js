import React, { useCallback, memo } from "react";
import Entry from "./CalendarEntry";
import "./Calendar.scss";

export default memo(({ year, data, setVideo }) => {
  const select = useCallback(
    e => {
      const video = e.currentTarget.getAttribute("data-url");
      const day = e.currentTarget.getAttribute("data-day");

      const id = `${year}/12/${day}`;
      setVideo(video, id);
    },
    [setVideo, year]
  );

  let filler = [];
  if (data.length < 24) {
    filler = new Array(24 - data.length).fill(null);
  }

  return (
    <div className="grid-container">
      <header className="title">
        <h1>
          <strong>24</strong> songs
          <small>{year}</small>
        </h1>
      </header>
      {data.map((item, i) => (
        <Entry key={item.artist} day={i + 1} item={item} select={select} />
      ))}
      {filler.map((n, i) => (
        <div key={i} className="filler" />
      ))}
    </div>
  );
});
