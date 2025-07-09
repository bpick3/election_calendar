function addElectionEventsToCalendar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("update sheet");
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 10).getValues();

  const calendarId = "update calendar id"; 
  const calendar = CalendarApp.getCalendarById(calendarId);
  const timeZone = Session.getScriptTimeZone();

  // Step 1: Delete all events in 2025
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2025, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day);
      const events = calendar.getEventsForDay(date);
      events.forEach(event => event.deleteEvent());
    }
  }

  // Step 2: Add new all-day events
  data.forEach((row, i) => {
    const [
      electionId,
      state,
      electionName,
      electionDayRaw,
      federal,
      statePos,
      regional,
      county,
      city,
      local
    ] = row;

    Logger.log(`Row ${i + 2} - Raw Date Value: ${electionDayRaw} | Type: ${typeof electionDayRaw}`);

    let parsedDate;

    if (typeof electionDayRaw === 'string') {
      const [year, month, day] = electionDayRaw.split('-').map(Number);
      parsedDate = new Date(year, month - 1, day);
    } else {
      parsedDate = new Date(electionDayRaw);
    }

    if (isNaN(parsedDate)) {
      Logger.log(`Row ${i + 2} - Cannot parse election date: ${electionDayRaw}`);
      return;
    }

    if (parsedDate.getFullYear() !== 2025) {
      Logger.log(`Row ${i + 2} - Not a 2025 election, skipping.`);
      return;
    }

    // Reconstruct local date using formatted string
    const dateString = Utilities.formatDate(parsedDate, timeZone, "yyyy-MM-dd");
    const [year, month, day] = dateString.split('-').map(Number);
    const startDate = new Date(year, month - 1, day); // Local midnight

    const title = `${state}: ${electionName}`;
    const description = `
<b>Election ID:</b> ${electionId}<br/>
<b>Federal Positions:</b> ${federal}<br/>
<b>State Positions:</b> ${statePos}<br/>
<b>Regional Positions:</b> ${regional}<br/>
<b>County Positions:</b> ${county}<br/>
<b>City Positions:</b> ${city}<br/>
<b>Local Positions:</b> ${local}
    `.trim();

    Logger.log(`Row ${i + 2} - Creating event: "${title}" on ${startDate.toDateString()}`);
    calendar.createAllDayEvent(title, startDate, {
      description: description
    });
  });

  Logger.log("Script completed.");
}
