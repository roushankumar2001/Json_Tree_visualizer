import { Node,Edge } from 'reactflow';

export interface CustomNode extends Node {
  path?: string;
}

let idCounter = 0;

export interface TreeData {
  [key: string]: any;
}

export function jsonToNodes(
  data: any,
  parentId: string | null = null,
  path = '$',
  depth = 0,
  expandedPaths: Set<string> = new Set(),
  maxDepth = 5
): { nodes: CustomNode[]; edges: Edge[] } {
  const nodes: CustomNode[] = [];
  const edges: Edge[] = [];

  const id = `n-${idCounter++}`;
  const label = path === '$' ? 'root' : path.split('.').slice(-1)[0];
  const isArray = Array.isArray(data);
  const isObject = typeof data === 'object' && data !== null && !isArray;

  // Determine children count
  const childCount = isArray
    ? data.length
    : isObject
    ? Object.keys(data).length
    : 0;

  const expandable = childCount > 0;
  const isLarge = childCount > 2; // 👈 auto-collapse if >2

  // Default collapsed state
  const isExpanded = expandedPaths.has(path) || (!isLarge && depth < maxDepth);

  nodes.push({
    id,
    data: {
      label:
        label +
        (isArray ? ` [${childCount}]` : isObject ? ' { }' : '') +
        (isLarge && !isExpanded ? ' (collapsed)' : ''),
      path,
      expandable,
    },
    position: { x: depth * 250, y: idCounter * 60 },
    style: {
      background: expandable ? '#eef' : '#fff',
      color: '#000',
      border: expandable ? '1px solid #0077ff' : '1px solid #aaa',
      borderRadius: 6,
      padding: 10,
      fontSize: 12,
      cursor: expandable ? 'pointer' : 'default',
    },
    path,
  });

  if (parentId) {
    edges.push({
      id: `e-${parentId}-${id}`,
      source: parentId,
      target: id,
    });
  }

  // Expand only if small or manually opened
  if (isExpanded) {
    if (isArray) {
      data.forEach((item, i) => {
        const child = jsonToNodes(
          item,
          id,
          `${path}[${i}]`,
          depth + 1,
          expandedPaths,
          maxDepth
        );
        nodes.push(...child.nodes);
        edges.push(...child.edges);
      });
    } else if (isObject) {
      for (const key in data) {
        const child = jsonToNodes(
          data[key],
          id,
          `${path}.${key}`,
          depth + 1,
          expandedPaths,
          maxDepth
        );
        nodes.push(...child.nodes);
        edges.push(...child.edges);
      }
    }
  }

  return { nodes, edges };
}
