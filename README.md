# H * E * L * I * O S

#### _A Game Project, 02/02/18_

### _**Michael Albers**_
### _With Dalia Ramos, Andy Grossberg, Kimberly Huynh, and Logan Tanous_

### DESCRIPTION

_This is the Team Project for Week Five of Intro to Programming at Epicodus_

### LOCATION

_You can find the files at https://www.github.com/mikealbers/helios

_Game is also hosted at https://mikealbers.github.io/Helios/

## Ship Exploration Module:

### METHODOLOGY

_Create a game window with a player ship and buildings to land on with the HTML cancas element and manipulating them with JS_

### IMPLEMENTATION SPECS

* Run when called upon (self contained method).

* On run create a canvas for display.

* Update the game area at a set interval.

* Create a player ship.

* When "W A S D" are pressed change player ship position.
  - INPUT: "W" is pressed.
  - OUTPUT: Player ship moves towards the top of the screen.
  
* At set interval buildings are made at the edge of the screen.

* At set interval buildings move along the screen.

* Player ship "colliding" with a building causes an event to trigger
  - INPUT: Player ship moves down and crashed into a grey building
  - OUTPUT: Game Over screen displays
  
* Other sets of buildings are made off screen and move at a different interval

* Player ship "landing" on second set of buildings causes other events to trigger.
  - INPUT: Player ship lands on white building
  - OUTPUT: Ship game stops running and another module is loaded. In this case an interior level.
  
#### FUTURE SPECS
* Levelevel load a specific map to generate buildings and obstacles.

* Flip direction the player can fly inorder to explore map

* Load specific interior levels based on building landed on

* Create obstacles for player to avoid

## Comms Hacking Module:

### RULES:

A large part of this game will revolve around interaction with Objects, primarily terminals and also Non-player Characters. Players will "hack" terminals to solve a puzzle or answer questions or enter a key sequence. If they are correct this function will pass true so the game knows to transition.

When interacting with NPCs, the player will see a picture of the character standing in front of a computer (or some variant) and an open window looking like a terminal of some sort that is expecting input.

The character will input keystrokes in response to prompts on screen

The game will respond to input based on context

Possible terminal prompt types:

Color code bar:
  - A sequence (string?) of 5 color squares and 5 blank squares under them. Underneath that are 4 color blocks (Red, Blue, Green, and Yellow) with numbers under them (1 - 4).
    SAMPLE INPUT: a sequence of digits
    SAMPLE OUTPUT: the corresponding color block of the digit pressed appears in each empty block.

Question:
  - A question with three possible answer choices under it.
    What is the password for Level 10?
    1) Cheesewiz; 2) Banana; 3) QWERTY
    SAMPLE INPUT: 1
    SAMPLE OUTPUT: SCREEN TURNS RED AND FLASHES A WARNING

Alphanumeric Sequence:
  - A 3 x 3 grid of alphanumeric characters
    SAMPLE INPUT: (A click on a grid char or keyboard input of the character)
    SAMPLE OUTPUT: SCREEN TURNS GREEN AND FADES INTO NEXT GAME LEVEL

### METHODOLOGY

_Andy chose to spread the three terminal types and the NPC holder onto four separate adjacent divs that were set to Display: None; where each was turned on as needed._
_If there was time they would have been positionable via X Y coordinates using Absolute positioning.

### IMPLEMENTATION SPECS

* Clear screen to terminal screen

* Make Terminal object {status, name, building location Number, building location room Number, room location X, room location Y, type, question array, answer array, success, failure}
  - Status (checked first when player enters a room with this terminal) "Unlocked" or "Locked" for a door, "Unsolved" or "Solved" for the other puzzles, "Alarm" if the alarm is triggered, "Deactivated" if it's turned off, and "Destroyed" if it's been damaged.
  - Questions array contains the color sequence, OR a question and possible answers, OR the digit sequence to be written to the keypad
  - Answer array contains the correct color sequence in letters, OR the correct answer, OR the correct digit sequence
  - Success contains the result if you succeed: 'Open' toggles the Status to Unlocked, 'Solved' to toggle a terminal to solved, '[sentence]' is a sequence of text that you get if you answer the questions correctly.
  - Failure contains what happens if you don't answer right: 'Nothing' means nothing happens, 'Alarm-5' means you get 5 tries before the status changes to Alarm, 'Locked' means the status changes to Locked

* Prompt user for any answer ("What is the answer?")
  - EXAMPLE INPUT: 43
  - EXAMPLE OUTPUT: Correct!

* Prompt a color sequence question based on the terminal prompt type from the object.
  - EXAMPLE PROMPT: R  G  B  Y  B
  - EXAMPLE INPUT: R G B B B
  - EXAMPLE OUTPUT: INCORRECT!
  <!-- - (follow Failure protocol) -->

* Prompt a text question and the answer numbers based on the terminal prompt type from the object.
  - EXAMPLE PROMPT: What is the entry code written in the Programming Office?
    - 1) Cheesewiz
    - 2) Banana
    - 3) QWERTY
  - EXAMPLE INPUT: 1
  - EXAMPLE OUTPUT: CORRECT!
  <!-- - (follow Success protocol) -->

* Prompt a keypad question based on the terminal prompt type from the object.
  - EXAMPLE PROMPT: 1 2 3 / 4 5 6 / 7 8 9
  - EXAMPLE INPUT: 2345
  - EXAMPLE OUTPUT: INCORRECT!
  <!-- - (follow Failure protocol) -->

* Enable check for correct answers

* create verifyAnswer method to check the answer
  - usage: myPrompt.verifyAnswer(x) where myPrompt is the terminal object and x is an array of answers.

* Display question in HTML panel (but still prompt)

* Display possible answers in HTML panel

* Alert actual Success or Failure result

* Check for clicks on keypad for doorcode answer

* Check for KB input to get answer for question <--

* Check for clicks on color bar for color question answer

* Add DIV for Talking to Person

* Convert Question code to handle it.

* Create looping mechansim to go through entire conversation tree with person.

* Capture keyboard input for navigation

* Work out entry and exit conditions

* Refactor code

### NEEDS UNDONE:

* We did not yet come up with a completely adequate Game Loop. Each module had to be clear about what event listeners were on or off so as to not trigger other parts that were not visible but still 'running' in their respective div. 

## SETUP/INSTALLATION REQUIEMENTS

* Download the files from the repository into appropriately named directories.
* Open the files with the browser of your choice.

## KNOWN BUGS
- When looping through NPC responses, the array index of one of the question levels is fence-posting so it gives an answer from the question before it.

- Key binding is not contained within each respective part of the game. For example the player character in the interior part of the game can be controlled before the level has loaded.

## SUPPORT AND CONTACT DETAILS

_You can contact us via albersmichael@tutanota.com.com_

## Technologies Used

_Uses HTML, CSS, javascript, and jQuery._

### License

*Distributed under the GPL*

Copyright (c) 2018 **_The Helios Team_**
