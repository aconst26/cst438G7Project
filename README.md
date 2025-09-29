# Welcome to Our Trivia Game

[Video Walkthrough]() 

[Github Repo](https://github.com/aconst26/cst438G7Project.git)

## Overview
Our application is a mobile trivia game that challenges users with fun and engaging questions. After signing up and logging in, users are directed to the quiz page where they can choose a category, difficulty level, and question format, either multiple choice or true/false. Each quiz is timed, and once the timer runs out, the quiz is automatically graded. The app also features a Daily Trivia page with a question of the day. If answered correctly, users earn points based on the difficulty level. All earned points are tracked in a leaderboard, allowing users to see how they rank against others based on their quiz and daily trivia performance.

## Introduction
* Communication Management:

   We communicated through Slack and in-person class meetups. Slack was used for daily updates and issue tracking, while meetups were used to discuss progress, troubleshoot issues, and plan upcoming features.
* Initial Stories/Issues Considered:
16 user stories were planned 
* Completed Stories/Issues:
We completed 14 stories

## Team Member Retrospectives
### Anthony Constante
1) Anthony’s Pull Request:

   [Created Signup Page](https://github.com/aconst26/cst438G7Project/pull/12) 

   [Backend Create Account + Database](https://github.com/aconst26/cst438G7Project/pull/21)

   [Created Leaderboards Page](https://github.com/aconst26/cst438G7Project/pull/24)

   [Polished Explore Page and Leaderboards Page](https://github.com/aconst26/cst438G7Project/pull/28) 

2) Anthony’s Github Issues:

   [Leaderboard Page](https://github.com/aconst26/cst438G7Project/issues/2) 

   [Signup Page](https://github.com/aconst26/cst438G7Project/issues/6)

   [Create Database](https://github.com/aconst26/cst438G7Project/issues/9)

   [Special XML Pages if Top 3](https://github.com/aconst26/cst438G7Project/issues/10) 

   [Initial App Setup](https://github.com/aconst26/cst438G7Project/issues/11)

   [Finished Backend for Signup Page](https://github.com/aconst26/cst438G7Project/issues/13)

### What was your role / which stories did you work on
My role was to work on the frontend and backend of the signup page and leaderboards section. I also had the role to make the finishing touches on the application and make sure all functionality works as expected/wanted.
+ What was the biggest challenge?
  The biggest challenge was definitely getting started/setting up the app with the necessary files.
+ Why was it a challenge?
  With no experience in React Native I was extremely overwhelmed and had no idea where to start or how to even get the app running. Even after watching videos I still somehow ended up with a completely wrong app foundation.
   + How was the challenge addressed?
     Challenge was addressed by asking for help from other friends and eventually I had my app foundation started.
+ Favorite / most interesting part of this project
  Favorite part of this project was collaborating with my teammates, I was lucky to have some very amazing teammates.
+ If you could do it over, what would you change?
  I would commit even more time to the project. Even though the project came out somewhat okay/better than expected I do wish I would have put in more effort.
+ What is the most valuable thing you learned?
  The most valuable thing I learned was how databases work with React Native Apps. A little bit tricky but there is some extremely useful information that can be applied to any upcoming project.

### Athena Lopez
1) Athena’s Pull Request:

   [Login Page Made](https://github.com/aconst26/cst438G7Project/pull/19)

   [Login Functionality](https://github.com/aconst26/cst438G7Project/pull/22)

   [Daily Trivia Page](https://github.com/aconst26/cst438G7Project/pull/27) 

2) Athena’s Github Issues:

   [Daily Trivia Questions](https://github.com/aconst26/cst438G7Project/issues/1)

   [Login Page](https://github.com/aconst26/cst438G7Project/issues/5)

   [Finished Backend of the Login Page](https://github.com/aconst26/cst438G7Project/issues/20)

### What was your role / which stories did you work on
I was responsible for implementing the login system and the Daily Trivia feature. For login, I validated user input, hashed passwords, authenticated credentials against our SQLite database, and routed users to the quiz page upon success. I also ensured the Sign-Up button redirected properly and stored user info using AsyncStorage. For the Daily Trivia page, I fetched a multiple-choice question from Open Trivia DB, decoded HTML entities, and awarded points based on difficulty. Points were stored in the database, and users were prevented from answering more than once per session.
+ What was the biggest challenge?   Getting the trivia questions from the API to work smoothly with our scoring system and database. I also ran into issues with Android Studio, which made it hard to test the app on my device.
   + Why was it a challenge?
   The API returned encoded HTML entities and inconsistent formats, which made it hard to display questions properly. Connecting the scoring system to the database also took careful testing to make sure everything updated correctly.
   + How was the challenge addressed?
   I used the HTML-entities library to clean up the question text, created a points system based on difficulty, and added retry logic in case the API failed. I also tested different edge cases to make sure the database handled updates correctly. 
+ Favorite / most interesting part of this project:
   Watching the app come together little by little and finally seeing it work as a complete functional app.
+ If you could do it over, what would you change?
   I’d spend more time learning how to write unit tests and use them to catch bugs earlier.
+ What is the most valuable thing you learned?
   I learned how to manage user sessions, connect to external APIs, and update a local database based on user actions. I also saw how important it is to validate input and handle errors carefully.

### William Peltz 
1) Will’s Pull Request:

   [Quiz page step one completed](https://github.com/aconst26/cst438G7Project/pull/17) 

   [Finished Rough Draft of Quiz Page Backend](https://github.com/aconst26/cst438G7Project/pull/23)

   [Completed Quiz Page Functionality with Option Select](https://github.com/aconst26/cst438G7Project/pull/29) 

2) Will’s Github Issues:
   
   [Select Categories for Questions Page](https://github.com/aconst26/cst438G7Project/issues/3)
 
   [Quiz Page](https://github.com/aconst26/cst438G7Project/issues/4)

   [Create Quiz Page with Questions Pulled from API](https://github.com/aconst26/cst438G7Project/issues/14)

   [Add Answer Selection and Quiz Grading with Grade Button and Timer](https://github.com/aconst26/cst438G7Project/issues/15)

   [Get Questions from Selected Criteria from the Previous Page](https://github.com/aconst26/cst438G7Project/issues/16)

   [Admin page](https://github.com/aconst26/cst438G7Project/issues/7)

### What was your role / which stories did you work on
I was responsible for the quiz page, including selecting quiz categories and other options on a separate page, and the admin page, which handles setting the daily question and ensuring that daily questions are consistent across users.

+ What was the biggest challenge?
  Easily the biggest challenge was implementing the option selection for the quiz page.
+ Why was it a challenge?
  While I have a lot of experience working with API's, particularly from Internet Programming, I have little to no experience with React. It was very difficult for me to pull info from the API, then use that to populate menus, then use user selections to make another API request.
   + How was the challenge addressed?
     I ended up researching a lot of different ways this could be done and slowly improving my approach. I talked with some friends, and my teammates, about which approach would work best for our project.
+ Favorite / most interesting part of this project
  The most interesting part for me was learning React. A while back I had an interview for an internship that went poorly because they really wanted someone comfortable with React (and I was not). It was really satisfying to fill a hole in my coding knowledge in an area that was personally interesting.
+ If you could do it over, what would you change?
  I would go in with more unit tests, complete database setups, and a better feel for the API early on. I think I would have saved myself a lot of headaches if I got a better feel for everything before I tried to code it.
  I would also make a lot more commits, I sort of completed an issue -> committed my work -> pushed -> made a PR all at once most of the time, and I think a more step by step process would have worked a lot better.
+ What is the most valuable thing you learned?
  Definitely working with React Native in general, especially how to do a lot of tasks that I understood in other mediums. Working with API's and databases and facilitating users and keeping the same experience across multiple users was really difficult for me to get right, but feel like skills that will help me a lot in the future.

## Conclusion
+ How Successful Was the Project?

With this app, we set out to build a trivia game that included a daily question, full quizzes, and a leaderboard. We successfully implemented all core features, fixed major bugs, and delivered a working, user-friendly experience. While there’s always room for improvement, we’re proud of what we accomplished within the time we had.
+ Largest Victory:

Our biggest win was getting all the major features of the quiz page, daily trivia, and leaderboard to work smoothly together. Each part had its own challenges, but seeing them connect and function as one complete app was the most rewarding part of the project. 
+ Final assessment:

The project was a success for the amount of time we had. Despite losing a team member early on, we adapted quickly and worked together to build a fully functional trivia app. Along the way, we gained valuable experience in mobile development, backend integration, and collaborative coding.
