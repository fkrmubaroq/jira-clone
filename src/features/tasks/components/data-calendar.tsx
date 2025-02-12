import { Button } from "@/components/ui/button";
import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "../types";
import "./data-calendar.css";
import EventCard from "./event-card";

const locales = {
  id: id,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export default function DataCalendar({ data }: { data: Task[] }) {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) || "",
      }}
      components={{
        eventWrapper: ({ event }) => {
          return (
            <EventCard
              id={event.id}
              title={event.title}
              assignee={event.assignee}
              project={event.project}
              status={event.status}
            />
          );
        },
        toolbar: () => {
          return <CustomToolbar date={value} onNavigate={handleNavigate} />;
        },
      }}
    />
  );
}

function CustomToolbar({
  date,
  onNavigate,
}: {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}) {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        onClick={() => onNavigate("PREV")}
        variant="secondary"
        size="icon"
        className="flex items-center !shadow-none"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-2 h-9 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-1" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        onClick={() => onNavigate("PREV")}
        variant="secondary"
        size="icon"
        className="flex items-center !shadow-none"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
