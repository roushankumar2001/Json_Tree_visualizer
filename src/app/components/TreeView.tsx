'use client';

import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow, NodeMouseHandler } from 'reactflow';
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

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const path = node.data?.path;
    if (!path || !node.data?.expandable) return;

    const newPaths = new Set(expandedPaths);
    if (expandedPaths.has(path)) {
      // Collapse
      newPaths.delete(path);
    } else {
      // Expand
      newPaths.add(path);
    }

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

  // Highlight logic (same as before)
  const highlightedNodes = nodes.map((n) => {
    if (!matchedPath) return n;

    let border = '1px solid #333';
    if (n.path === matchedPath) border = '3px solid red';
    else if (matchedPath.startsWith(n.path)) border = '3px solid green';
    else if (n.path.startsWith(matchedPath)) border = '3px solid yellow';

    return {
      ...n,
      style: {
        ...n.style,
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
    <div className="h-[700px] w-full border rounded relative">
      <ReactFlow
        nodes={highlightedNodes}
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
        <MiniMap nodeColor={(n: any): string => n.style?.background ?? '#ccc'} />        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
