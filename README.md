# Agent Native App Framework

Agent Native App Framework is an open-source TypeScript SDK for making apps understandable and operable by AI agents through semantic screens, actions, state, and safety constraints.

Instead of forcing an AI agent to guess from screenshots, DOM trees, accessibility labels, or brittle coordinates, an app can expose a structured action graph: screens, UI elements, actions, state, navigation targets, and permission rules.

This is for developers building agent-native apps, AI automation layers, app-control SDKs, React agent interfaces, Flutter agent interfaces, and cross-app AI workflows.

GitHub: https://github.com/uphomesco-hub/agent-native-app-framework

## Keywords

AI agents, agent-native apps, app automation, semantic UI, action graph, agent SDK, AI app framework, React agents, Flutter agents, mobile agents, cross-app workflows, safe agent actions, computer use, tool use, app control.

## Why this exists

Most AI agents operate software from the outside. They look at pixels, infer intent, click where they think a button is, and hope the UI has not changed.

That is useful, but it is not a stable foundation for serious app automation. Apps already know what their screens, buttons, forms, workflows, and business rules mean. This framework is the start of a developer layer that lets apps publish that meaning directly.

The goal is simple:

> Make apps agent-operable by design.

## Who this is for

- App developers who want AI agents to operate their product reliably.
- AI agent builders who need stable app actions instead of screen-scraping.
- React, Flutter, and mobile teams exploring agent-ready UI architecture.
- Teams designing safe automation for checkout, booking, support, CRM, internal tools, or marketplace workflows.
- Researchers and founders working on computer-use agents, MCP-style tool systems, or app-control protocols.

## What problem it solves

Traditional computer-use agents are powerful, but fragile:

- A button moving can break an automation.
- Visual labels often hide business meaning.
- Screenshots do not expose state, permissions, or risk.
- Agents cannot reliably tell which actions need user confirmation.
- Cross-app workflows are hard to compose safely.

Agent Native App Framework moves that meaning into a developer-owned manifest so agents can inspect allowed actions before planning.

## What the framework describes

An app manifest can declare:

- **Screens**: routes, titles, purposes, and relevant state.
- **Elements**: buttons, inputs, cards, menus, toggles, lists, and custom controls.
- **Actions**: what an agent may do, required inputs, expected outputs, and next screen.
- **State**: what the screen reads or writes, including sensitive fields.
- **Constraints**: auth, permissions, confirmations, rate limits, business rules, and safety boundaries.
- **Capabilities**: higher-level workflows composed from multiple actions.

From that manifest, the SDK builds an action graph that an agent can inspect before planning a task.

## Use cases

- Let an AI assistant fill a cart, compare plans, or prepare checkout while requiring human approval for payment.
- Let a support agent navigate an internal dashboard through typed actions instead of brittle selectors.
- Let a mobile app expose safe agent actions for booking, ordering, scheduling, or navigation.
- Let a workflow agent chain actions across compatible apps with explicit permission boundaries.
- Let app teams publish machine-readable UI intent alongside normal React or Flutter code.

## How it works

1. Developers describe screens, elements, actions, state, and constraints.
2. The SDK registers the app manifest and builds a graph of available actions.
3. An agent planner reads the graph before choosing actions.
4. Risky actions can require confirmation, permission scopes, or human approval.
5. Future adapters can generate manifests from React components, Flutter widgets, or runtime state snapshots.

## First draft scope

This repo is intentionally small. It is not a production framework yet.

Current draft includes:

- TypeScript schema types for agent-native app manifests.
- A registry for loading app manifests.
- An action graph builder.
- A tiny planner that turns action IDs into plan steps and detects human-approval requirements.
- A React-style commerce descriptor example.
- A Flutter-style food-ordering descriptor example.

Future versions should add real React and Flutter adapters, runtime state synchronization, schema validation, signed app manifests, agent permission scopes, developer tooling, and cross-app workflow handoffs.

## Example

```ts
import { AgentActionPlanner, AgentAppRegistry } from "agent-native-app-framework";
import { commerceManifest } from "./examples/react-commerce.js";

const registry = new AgentAppRegistry();
registry.register(commerceManifest);

const graph = registry.buildActionGraph("demo-commerce");
const planner = new AgentActionPlanner(registry);

const plan = planner.planByActionIds("demo-commerce", [
  "search-products",
  "add-to-cart",
  "start-checkout"
]);

console.log(graph.nodes.length);
console.log(planner.requiresHumanApproval(plan)); // true, checkout is high-risk
```

## Example manifest shape

```ts
{
  id: "demo-commerce",
  name: "Demo Commerce",
  version: "0.1.0",
  screens: [
    {
      id: "cart",
      title: "Cart",
      purpose: "Review cart contents before checkout.",
      route: "/cart",
      elements: [
        {
          id: "checkout-button",
          kind: "button",
          label: "Checkout",
          purpose: "Start checkout after the user confirms purchase intent.",
          actions: [
            {
              id: "start-checkout",
              title: "Start checkout",
              description: "Open the checkout flow.",
              risk: "high",
              requiresConfirmation: true
            }
          ]
        }
      ]
    }
  ]
}
```

## Cross-app direction

The bigger idea is not limited to one app.

If multiple apps expose compatible action graphs, an agent can safely chain workflows across app boundaries. For example, a food-ordering app could expose pickup and drop coordinates, then hand those coordinates to a maps app through a typed, permissioned action instead of relying on screen scraping.

That future needs strong permission design:

- Apps should choose which actions are exposed.
- Users should approve risky actions.
- Agents should receive scoped access, not unlimited control.
- Sensitive fields should be marked and protected.
- Cross-app handoffs should be explicit and auditable.

## Design principles

- **Semantic over visual**: agents should use declared intent, not guess from pixels.
- **Stable over brittle**: app updates should not break workflows just because a button moved.
- **Safe by default**: destructive, paid, external, or sensitive actions need constraints and confirmation.
- **Developer-friendly**: annotations and manifests should fit normal React, Flutter, and mobile development workflows.
- **Agent-agnostic**: the graph should work with any capable AI agent, not one vendor.

## Development

Install dependencies:

```bash
npm install
```

Run type checks:

```bash
npm run check
```

Build:

```bash
npm run build
```

Run the TypeScript example after building:

```bash
node dist/examples/react-commerce.js
```

## Roadmap

- React annotations and hooks for registering screens/actions.
- Flutter widget annotations and manifest generation.
- JSON Schema validation for app manifests.
- Runtime state snapshots.
- Permission scopes for agents.
- Signed manifests for trusted app-agent communication.
- Local developer inspector for browsing the action graph.
- Cross-app action handoff protocol.

## YC two-liner

I am building Agent Native App Framework, a developer SDK that lets apps expose semantic screens, actions, state, and safety rules so AI agents can operate them reliably without brittle screen scraping.

The long-term vision is an agent-operable app ecosystem where React, Flutter, and mobile apps publish trusted action graphs, enabling safe workflows inside one app and across many apps.
