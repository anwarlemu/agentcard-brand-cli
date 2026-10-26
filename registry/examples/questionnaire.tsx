"use client";

import * as React from "react";

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";

const ITEMS = [
  { name: "use", required: true, choices: [{ value: "travel" }, { value: "supplies" }, { value: "software" }] },
  { name: "merchants", multiple: true, choices: [{ value: "amazon" }, { value: "doordash" }, { value: "airlines" }, { value: "hotels" }] },
  { name: "limit", required: true, choices: [{ value: "single" }, { value: "monthly" }, { value: "none" }] },
] as const;

export function Site() {
  const [saved, setSaved] = React.useState<string>();
  return (
    <div className="mx-auto grid w-full max-w-110 gap-4">
      <Questionnaire
        items={ITEMS}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSaved(`Use: ${data.get("use")}. Merchants: ${data.getAll("merchants").join(", ") || "any"}. Limit: ${data.get("limit")}.`);
        }}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="use" required>
          <QuestionnaireTitle>What will this agent buy?</QuestionnaireTitle>
          <QuestionnaireDescription>We set the card up for it. Choose one, or describe it.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="travel">
              <span className="font-display font-medium tracking-tight">Travel</span>
              <QuestionnaireChoiceDescription>Flights, trains and hotels</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="supplies">
              <span className="font-display font-medium tracking-tight">Office supplies</span>
              <QuestionnaireChoiceDescription>Staples, Amazon and similar stores</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="software">
              <span className="font-display font-medium tracking-tight">Software</span>
              <QuestionnaireChoiceDescription>Subscriptions and API credits</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireInput aria-label="Something else" placeholder="Something else" />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="merchants" multiple>
          <QuestionnaireTitle>Where can it pay?</QuestionnaireTitle>
          <QuestionnaireDescription>Choose any, or skip to allow every store.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="amazon">Amazon</QuestionnaireChoice>
            <QuestionnaireChoice value="doordash">DoorDash</QuestionnaireChoice>
            <QuestionnaireChoice value="airlines">Airlines</QuestionnaireChoice>
            <QuestionnaireChoice value="hotels">Hotels</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="limit" required>
          <QuestionnaireTitle>How should the card be limited?</QuestionnaireTitle>
          <QuestionnaireDescription>You can change this later in the card’s settings.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="single">Single use, then it closes</QuestionnaireChoice>
            <QuestionnaireChoice value="monthly">A monthly limit</QuestionnaireChoice>
            <QuestionnaireChoice value="none">No limit</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Create card</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
      {saved && (
        <p role="status" className="rounded-control border border-hairline bg-note px-3.5 py-2.5 text-body-sm text-fg">
          Card created. {saved}
        </p>
      )}
    </div>
  );
}

const ISSUING = [{ name: "type", required: true, choices: [{ value: "virtual" }, { value: "physical" }, { value: "commercial" }] }] as const;

export function Disabled() {
  return (
    <Questionnaire items={ISSUING} shortcuts="letters" className="mx-auto max-w-110" onSubmit={(event) => event.preventDefault()}>
      <QuestionnaireItem name="type" required>
        <QuestionnaireTitle>Which kind of card?</QuestionnaireTitle>
        <QuestionnaireDescription>Physical cards are not available on your plan.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="virtual">
            <span className="font-display font-medium tracking-tight">Virtual</span>
            <QuestionnaireChoiceDescription>Ready to use at once</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="physical" disabled>
            <span className="font-display font-medium tracking-tight">Physical</span>
            <QuestionnaireChoiceDescription>Not on your plan</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="commercial">
            <span className="font-display font-medium tracking-tight">Commercial</span>
            <QuestionnaireChoiceDescription>Billed to your company</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit>Issue card</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
