import type { ActionPlanStep, RiskLevel } from "./types.js";
import { AgentAppRegistry, toNodeId } from "./registry.js";

export class AgentActionPlanner {
  constructor(private readonly registry: AgentAppRegistry) {}

  planByActionIds(appId: string, actionIds: string[]): ActionPlanStep[] {
    return actionIds.map((actionId) => {
      const node = this.registry.findAction(appId, actionId);
      if (!node) {
        throw new Error(`Action "${actionId}" was not found in app "${appId}".`);
      }

      return {
        nodeId: toNodeId(node),
        title: node.action.title,
        risk: node.action.risk ?? "low",
        requiresConfirmation: Boolean(node.action.requiresConfirmation)
      };
    });
  }

  requiresHumanApproval(plan: ActionPlanStep[], minimumRisk: RiskLevel = "high"): boolean {
    return plan.some((step) => step.requiresConfirmation || riskRank(step.risk) >= riskRank(minimumRisk));
  }
}

function riskRank(risk: RiskLevel): number {
  return { low: 1, medium: 2, high: 3 }[risk];
}
