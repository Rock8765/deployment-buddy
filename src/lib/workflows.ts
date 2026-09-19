export type WorkflowMeta = {
  id: string;
  file: string;
  name: string;
  cat: string;
  nodes: number;
  ai: boolean;
  triggers: string[];
  active: boolean;
  complexity: "simple" | "medium" | "complex";
  triggerType: "manual" | "scheduled" | "triggered" | "webhook";
  services: string[];
  serviceCount: number;
  desc: string;
};

export type WorkflowCategory = {
  id: string;
  label: string;
  count: number;
};

export type WorkflowIndex = {
  total: number;
  totalNodes: number;
  activeCount: number;
  integrationCount: number;
  aiCount: number;
  categories: WorkflowCategory[];
  items: WorkflowMeta[];
};


export type WorkflowDetail = WorkflowMeta & {
  nodesList: { name: string; type: string }[];
};

export async function fetchIndex(): Promise<WorkflowIndex> {
  const res = await fetch("/workflows/index.json");
  if (!res.ok) throw new Error(`Failed to load workflow index (${res.status})`);
  return res.json();
}

export async function fetchWorkflowFile(file: string): Promise<object> {
  const res = await fetch(`/workflows/${file}`);
  if (!res.ok) throw new Error(`Failed to load workflow (${res.status})`);
  return res.json();
}

export function buildDetail(meta: WorkflowMeta, raw: any): WorkflowDetail {
  const nodesList = Array.isArray(raw?.nodes)
    ? raw.nodes.slice(0, 200).map((n: any) => ({
        name: String(n?.name ?? "Untitled node"),
        type: String(n?.type ?? "unknown"),
      }))
    : [];
  return { ...meta, nodesList };
}

export function shortNodeType(type: string): string {
  const t = type.replace(/^n8n-nodes-base\./, "").replace(/^@n8n\/n8n-nodes-langchain\./, "langchain.");
  return t.split(".").pop() ?? t;
}
