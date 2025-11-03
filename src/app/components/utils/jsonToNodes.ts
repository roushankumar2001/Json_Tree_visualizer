import { Node, Edge } from 'reactflow';

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
  const type: 'object' | 'array' | 'primitive' =
    isArray ? 'array' : isObject ? 'object' : 'primitive';

  // Determine children count
  const childCount = isArray
    ? data.length
    : isObject
    ? Object.keys(data).length
    : 0;

  const expandable = childCount > 0;
  const isLarge = childCount > 2; // auto-collapse large nodes
  const isExpanded = expandedPaths.has(path) || (!isLarge && depth < maxDepth);

  // 🌈 Color coding by data type
  const typeColors = {
    object: '#a2b4ff',   // blue/purple tone
    array: '#a6f7b5',    // green tone
    primitive: '#ffd580' // yellow/orange tone
  };

  const background = typeColors[type];

  nodes.push({
    id,
    data: {
      label:
        label +
        (isArray ? ` [${childCount}]` : isObject ? ' { }' : `: ${String(data)}`) +
        (isLarge && !isExpanded ? ' (collapsed)' : ''),
      path,
      expandable,
      type, // 👈 added for TreeView styling
    },
    position: { x: depth * 250, y: idCounter * 60 },
    style: {
      background,
      color: '#000',
      border: expandable ? '1px solid #333' : '1px solid #999',
      borderRadius: 6,
      padding: 10,
      fontSize: 12,
      cursor: expandable ? 'pointer' : 'default',
      boxShadow: expandable ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
    },
    path,
  });

  if (parentId) {
    edges.push({
      id: `e-${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'smoothstep',
      animated: true,
    });
  }

  // Recursive expansion
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
      };
    }
  }

  return { nodes, edges };
}
