export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type RiskLevel = "low" | "medium" | "high";

export interface AgentAppManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  screens: AgentScreen[];
  capabilities?: AgentCapability[];
}

export interface AgentScreen {
  id: string;
  title: string;
  purpose: string;
  route?: string;
  elements: AgentElement[];
  state?: AgentStateField[];
}

export interface AgentElement {
  id: string;
  kind: "button" | "input" | "link" | "list" | "card" | "menu" | "toggle" | "custom";
  label?: string;
  purpose: string;
  actions?: AgentAction[];
  constraints?: AgentConstraint[];
  readsState?: string[];
  writesState?: string[];
}

export interface AgentAction {
  id: string;
  title: string;
  description: string;
  inputSchema?: Record<string, JsonValue>;
  outputSchema?: Record<string, JsonValue>;
  navigatesTo?: string;
  risk?: RiskLevel;
  requiresConfirmation?: boolean;
}

export interface AgentStateField {
  key: string;
  description: string;
  valueType: "string" | "number" | "boolean" | "object" | "array" | "unknown";
  sensitive?: boolean;
}

export interface AgentConstraint {
  type: "auth" | "permission" | "confirmation" | "rate-limit" | "business-rule" | "safety";
  description: string;
}

export interface AgentCapability {
  id: string;
  description: string;
  actions: string[];
}

export interface ActionNode {
  appId: string;
  screenId: string;
  elementId: string;
  action: AgentAction;
}

export interface ActionEdge {
  from: string;
  to: string;
  reason: string;
}

export interface ActionGraph {
  nodes: ActionNode[];
  edges: ActionEdge[];
}

export interface ActionPlanStep {
  nodeId: string;
  title: string;
  risk: RiskLevel;
  requiresConfirmation: boolean;
}
