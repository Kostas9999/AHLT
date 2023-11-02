import React from "react";
import Tree from "react-d3-tree";

const treeStyles = {
  links: {
    stroke: "blue", // Set the desired color
  },
};

const containerStyles = {
  width: "100%",
  height: "100%", // Set an appropriate height for your tree
  backgroundColor: "white",
};

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.

const orgChart = {
  name: "S",
  children: [
    {
      name: "NP",

      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Foreman",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
        {
          name: "Foreman",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
      ],
    },
  ],
};
const config = {
  nodeSize: { x: 200, y: 100 }, // Adjust the node size as needed
  separation: { siblings: 1, nonSiblings: 2 },
  zoom: 0.6, // Adjust the zoom level as needed
  orientation: "vertical", // Set the tree orientation to "vertical"
};

export default function OrgChartTree() {
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div style={containerStyles}>
      <Tree
        data={orgChart}
        orientation={config.orientation}
        zoom={config.zoom}
        translate={{ x: 350, y: 50 }}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        pathClassFunc="node__leaf"
        styles={treeStyles}
      />
    </div>
  );
}