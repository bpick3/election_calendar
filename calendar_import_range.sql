={
  IMPORTRANGE("https://docs.google.com/spreadsheets/d/1c4qEkXmQJCvCKV_racf3QHspR-JaINEI35z1w_C5MeU", "'2025 Upcoming Elections'!A1:J3");
  QUERY(
    IMPORTRANGE("https://docs.google.com/spreadsheets/d/1c4qEkXmQJCvCKV_racf3QHspR-JaINEI35z1w_C5MeU", "'2025 Upcoming Elections'!A4:J"),
    "SELECT * WHERE Col2 MATCHES '^(AZ|CO|FL|GA|ME|MI|NC|NE|NY|OH|OK|PA|WA|WI|KY|ND|NV)$'"
  )
}
-- update stac states above
