import type { ActionGraph, ActionNode, AgentAppManifest } from "./types.js";

export class AgentAppRegistry {
  private readonly manifests = new Map<string, AgentAppManifest>();

  register(manifest: AgentAppManifest): void {
    assertUniqueManifestIds(manifest);
    this.manifests.set(manifest.id, manifest);
  }

  list(): AgentAppManifest[] {
    return [...this.manifests.values()];
  }

  get(appId: string): AgentAppManifest | undefined {
    return this.manifests.get(appId);
  }

  buildActionGraph(appId: string): ActionGraph {
    const manifest = this.requireManifest(appId);
    const nodes: ActionNode[] = [];

    for (const screen of manifest.screens) {
      for (const element of screen.elements) {
        for (const action of element.actions ?? []) {
          nodes.push({
            appId: manifest.id,
            screenId: screen.id,
            elementId: element.id,
            action
          });
        }
      }
    }

    const nodeIds = new Set(nodes.map(toNodeId));
    const edges = nodes
      .filter((node) => node.action.navigatesTo)
      .flatMap((node) => {
        const targetScreen = node.action.navigatesTo;
        const targetNodes = nodes.filter((candidate) => candidate.screenId === targetScreen);
        return targetNodes.map((target) => ({
          from: toNodeId(node),
          to: toNodeId(target),
          reason: `${node.action.id} navigates to ${targetScreen}`
        }));
      })
      .filter((edge) => nodeIds.has(edge.to));

    return { nodes, edges };
  }

  findAction(appId: string, actionId: string): ActionNode | undefined {
    return this.buildActionGraph(appId).nodes.find((node) => node.action.id === actionId);
  }

  private requireManifest(appId: string): AgentAppManifest {
    const manifest = this.manifests.get(appId);
    if (!manifest) {
      throw new Error(`No app manifest registered for "${appId}".`);
    }
    return manifest;
  }
}

export function toNodeId(node: ActionNode): string {
  return `${node.appId}:${node.screenId}:${node.elementId}:${node.action.id}`;
}

function assertUniqueManifestIds(manifest: AgentAppManifest): void {
  const ids = new Set<string>();

  for (const screen of manifest.screens) {
    assertUnique(ids, `screen:${screen.id}`);

    for (const element of screen.elements) {
      assertUnique(ids, `element:${screen.id}:${element.id}`);

      for (const action of element.actions ?? []) {
        assertUnique(ids, `action:${screen.id}:${element.id}:${action.id}`);
      }
    }
  }
}

function assertUnique(ids: Set<string>, id: string): void {
  if (ids.has(id)) {
    throw new Error(`Duplicate manifest id "${id}".`);
  }
  ids.add(id);
}
