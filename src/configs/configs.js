export const license = "64323798534861264567"; // license: "64323798534861264567";

export const server_url = "https://fabian-learning.herokuapp.com";
//export const server_url = "http://localhost:5000";

export const application_cards_path =
//"C:/SmartyPants_database/question_cards/";
"/Users/FabianAlvarado/Documents/Learning/practicing_tool/database_files/question_cards/";


export const application_diagrams_path = //"C:/SmartyPants_database/diagrams/";
"/Users/FabianAlvarado/Documents/Learning/practicing_tool/database_files/diagrams/";

export const subjects_list_file_name = "subjects_to_pick_from.csv";

export const readings_limit = 20;

export const formattingDate = ( milliseconds_date ) => {
  // Creating the date and time formats, they will be later exported on the return statement
  const day_format = { weekday: "short" };
  const time_format = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  const date_format = { day: "numeric", month: "short", year: "numeric" };
  const locale_mx = "es-MX";
  const locale_us = "en-US";

  // It can accept the sent data, or it can be empty so the current time is taken
  //We are adding a mew comparison, so when the provided valuer is not a number, we return it as is:

  if(typeof milliseconds_date === 'number'){
    return `${new Date(milliseconds_date || new Date()).toLocaleTimeString(
      locale_us,
      time_format
    )} - ${new Date(milliseconds_date || new Date()).toLocaleDateString(
      locale_us,
      day_format
    )} ${new Date(milliseconds_date || new Date()).toLocaleDateString(
      locale_us,
      date_format
    )}`;
  }else{
    return milliseconds_date;
  }
};

export const formattingDateNoSeconds = ( milliseconds_date ) => {
  // Creating the date and time formats, they will be later exported on the return statement
  const day_format = { weekday: "short" };
  const time_format = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  };
  const date_format = { day: "numeric", month: "short", year: "numeric" };
  const locale_mx = "es-MX";
  const locale_us = "en-US";

  // It can accept the sent data, or it can be empty so the current time is taken
  //We are adding a mew comparison, so when the provided valuer is not a number, we return it as is:

  if(typeof milliseconds_date === 'number'){
    return `${new Date(milliseconds_date || new Date()).toLocaleTimeString(
      locale_us,
      time_format
    )} hrs. - ${new Date(milliseconds_date || new Date()).toLocaleDateString(
      locale_us,
      day_format
    )} ${new Date(milliseconds_date || new Date()).toLocaleDateString(
      locale_us,
      date_format
    )}`;
  }else{
    return milliseconds_date;
  }
};
