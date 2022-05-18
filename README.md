# Progressive Difficulty Wordle

Is Wordle, as a concept played out? I would argue that the answer is yes. And yet, here we are, with yet another variant that I've created.

## Why?

Is this strictly necessary for a 'Read Me' file? No, but it's time to stop posing pointless questions, and you've already started reading it, so you've either made the choice to humor me, or you've finally decided to stop reading. Both are more than acceptable (and I know which one I'd choose in your position). The truth is, over the past several years, I've been in a position with a minimum of front-end development responsibilities, and did not sufficiently pursue my own growth in my own time. As such, a quick and dirty full-stack application like this is going to serve as something of a warm-up for future work, as well as offering the opportunity to try my hand with some concepts I haven't really touched before (none of which are exciting enough to wax about here).

## Blah, Blah, Blah, What Does it Do?

1. This is an ASP.Net Core and Typescript implementation of the core Wordle concept. Almost everything is in JavaScript, so the C# back-end is nearly useless from a functionality standpoint, but I want this to use .Net so we'll all have to deal with it.
2. Offers multiple gamemodes, wow.
    - **Classic**: For those who lack self-control, but only want the site to allow them to do one puzzle in a day.
    - **Endless**: For those who just want to do puzzle after puzzle after puzzle after puzzle <sup>after puzzle after puzzle</sup> ad nauseaum.
    - **Progressive Difficulty**: Hey, that's what this application is named for. Adds an additional scaling rule-set on top of the traditional gameplay that grows harder over time. Includes timers, "hard-mode" requirements, lowers maximum guess count, and whatever else I decide to throw in there. Aim for a high-score with my proprietary and totally legitimate and balanced scoring system.
3. Tracks state through browser side cookies including:
    - Dark/Night theme selection.
    - Hard mode selection, for the traditionalists who enjoy forced plays in a poorly named mode.
    - Gameplay statistics and high score history.
4. Deploys in conjunction with GitHub Actions and Azure. Find the deployed version at https://progressivedifficultywordle20220517175626.azurewebsites.net/