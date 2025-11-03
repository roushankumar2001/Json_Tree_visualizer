'use client';

import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { jsonToNodes } from './utils/jsonToNodes';

export default function TreeView({
  nodes,
  edges,
  dark,
  matchedPath,
  fullJson,
  setNodes,
  setEdges,
  expandedPaths,
  setExpandedPaths,
}: {
  nodes: any[];
  edges: any[];
  dark: boolean;
  matchedPath?: string | null;
  fullJson: any;
  setNodes: (n: any[]) => void;
  setEdges: (e: any[]) => void;
  expandedPaths: Set<string>;
  setExpandedPaths: (s: Set<string>) => void;
}) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodes.length) fitView({ padding: 0.2 });
  }, [nodes, fitView]);

  // 🟢 Handle expand/collapse logic
  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const path = node.data?.path;
    if (!path || !node.data?.expandable) return;

    const newPaths = new Set(expandedPaths);
    if (expandedPaths.has(path)) newPaths.delete(path);
    else newPaths.add(path);

    setExpandedPaths(newPaths);

    const { nodes: newNodes, edges: newEdges } = jsonToNodes(
      fullJson,
      null,
      '$',
      0,
      newPaths
    );
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // 🌈 Type-based color coding
  const getNodeColor = (type: string): string => {
    switch (type) {
      case 'object':
        return dark ? '#4b5dff' : '#a2b4ff'; // blue/purple
      case 'array':
        return dark ? '#3fbf6b' : '#a6f7b5'; // green
      default:
        return dark ? '#ffb347' : '#ffd580'; // yellow/orange (primitive)
    }
  };

  // 🎯 Highlight logic + color code styling
  const styledNodes = nodes.map((n) => {
    const color = getNodeColor(n.data?.type);
    let border = '1px solid #333';

    if (matchedPath) {
      if (n.path === matchedPath) border = '3px solid red';
      else if (matchedPath.startsWith(n.path)) border = '3px solid green';
      else if (n.path.startsWith(matchedPath)) border = '3px solid yellow';
    }

    return {
      ...n,
      style: {
        background: color,
        color: dark ? '#fff' : '#000',
        borderRadius: 8,
        padding: 6,
        border,
        boxShadow:
          border === '3px solid red'
            ? '0 0 10px red'
            : border === '3px solid green'
            ? '0 0 6px green'
            : border === '3px solid yellow'
            ? '0 0 6px gold'
            : 'none',
      },
    };
  });

  return (
    <div className="h-[600px] w-full border rounded relative">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: dark ? '#fff' : '#333' },
        }}
        style={{ background: dark ? '#111' : '#fff' }}
      >
        <MiniMap
          nodeColor={(n: any) => n.style?.background ?? '#ccc'}
        />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
