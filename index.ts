import { parse } from "rector-schedule-parser";
import ical, { ICalEvent } from "ical-generator";
import fs from "fs";

async function main() {
  const cal = ical({ name: "Stankin" });
  const data = await parse("file.pdf");
  for (const pair of data) {
    for (const period of pair.periods) {
      const startDate = new Date(
        new Date().getFullYear(),
        parseInt(period.start_date.split(".")[1]) - 1,
        parseInt(period.start_date.split(".")[0]),
        parseInt(pair.start_time.split(":")[0]),
        parseInt(pair.start_time.split(":")[1])
      );
      const endDate = new Date(
        new Date().getFullYear(),
        parseInt(period.end_date.split(".")[1]) - 1,
        parseInt(period.end_date.split(".")[0]),
        parseInt(pair.end_time.split(":")[0]),
        parseInt(pair.end_time.split(":")[1])
      );
      for (
        let day = startDate;
        day <= endDate;
        day.setDate(day.getDate() + (period.repeat === "к.н." ? 7 : 14))
      ) {
        const start = new Date(day);
        const end = new Date(
          new Date(day).setHours(endDate.getHours(), endDate.getMinutes())
        );
        cal.createEvent({
          start,
          end,
          summary:
            pair.subject +
            (pair.group === "Без подгруппы" ? "" : ` ${pair.group}`) +
            ` (${pair.type})`,
          location: pair.audience,
          description: `${pair.teacher}`,
        });
      }
    }
  }

  fs.writeFileSync("stankin.ics", cal.toString());
}

main();
