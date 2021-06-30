## Description

You're given a design mockup of a calendar application (similar to Outlook or Google Calendar). See the included file: `calendar.pdf`

The specifications are vague but can be inferred from the design mockup. For example:

1. Events with start/end dates and all-day events should both be supported.
1. Each event has a name and location.
1. No events may visually overlap.
1. If two events overlap in time, they must have the same width.
1. An event should utilize the maximum width available, but constraint 4 takes precedence over this constraint.
1. If extra events are added to the data set, they should reflect properly on the front-end.


## Deliverables

There are two facets to the test:

1. Create a test fixture in a data file (CSV, JSON, YAML, etc) to populate the calendar. You don't need to write code to generate the test fixture, just create and submit the data file itself. We must be able to change the data file and see the results without recompiling, so that we can test the logic thoroughly.
1. Develop an HTML / CSS / Javascript application that loads in the data file and populates a calendar matching the mockup provided. The code should render your test data correctly, but should also handle any other collection of events that might occur in production.

You should not use any Javascript framework or third-party libraries in your solution. Do not use React, Angular, Vue, JQuery, etc. Use vanilla Javascript. You may use up to the latest version of ECMAScript that runs in the current version of Chrome.

Please email your solution in a zip file. The zip file should include an `index.html` file in the root directory, along with all necessary code and data to run and code review the solution.

We should be able to view your solution by opening `index.html` in the latest version of Chrome. This means your code should already be compiled. Do not submit code that requires us to install dependencies, compile, or run a local web server.

Do not post your solution anywhere online or in a public repository (Github, Bitbucket, etc) where others could find it.


## Assessment

Your code will be assessed on: 

- Accuracy of logic
- Completeness of solution
- Design
- Code quality (cleanliness, readability, maintainability, simplicity)
- Accuracy of following these instructions

Your code *will not* be assessed on:

- Performance. Don't worry about making it run fast.
- Features that are not present in the mockup. No need to go beyond the specified scope.
- Turnaround time. This is not a timed coding test. Please take your time in devising your solution.

Please write production quality code, don't just solve the problem quickly. Create a solution that you would consider to be *good* code.


## FAQ

- **Are frameworks/libraries such as jQuery, React, mustache.js, etc. allowed?** No, please use vanilla Javascript only. Do not use third party libraries or frameworks.
- **Which browsers need to be supported?** Only the latest version of Chrome needs to be supported. You may use any version of ECMAScript that runs in the latest version of Chrome.
- **Can I require that NPM be used to build my solution?** You may build your solution with NPM if you like (for SCSS etc), but you need to submit the source and compiled code such that we can review your code and view your solution by opening `index.html`. We will not run any compilation to view your solution.
- **Can I require that compilation be run to show new data in the data file?** No. We should be able to see updated data by changing your data file and refreshing `index.html` in the browser.
- **Does my solution need to match the mockup pixel for pixel?** No, we will not be testing for pixel matching, but it should look the same to the naked eye.

That's it! Figure it out as best you can. No questions are allowed.
