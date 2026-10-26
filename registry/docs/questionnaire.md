---
name: questionnaire
title: Questionnaire
type: ui
surface: site
description: "Questions asked one at a time: white key choices with the brand's checkbox or radio and a shortcut key, a display-face question, a sunken progress bar, and Previous, Skip and Next keys."
use_for: "Use to set something up in a few steps (a card for a new agent, a merchant list). Pass items (name, required, multiple, choices) to Questionnaire, then one QuestionnaireItem per question with its title, description, choices, an optional QuestionnaireInput for another answer and QuestionnaireError. End with QuestionnaireActions. The answers submit as one native form (FormData); the page saves them. Number keys (or letters) pick choices; Enter moves on."
never: [More than five questions, Several questions on one screen, Animated transitions between questions, A choice without a visible label]
source: "Extrapolated from Agentcard: the white key (agentcard-website .v7-btn), the checkbox and the progress bar of the library, and the pricing plans' choices"
---
