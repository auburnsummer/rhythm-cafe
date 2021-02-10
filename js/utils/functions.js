// Quick wrapper function for setting a state with an event
export const setThis = func => evt => func(evt.target.value);