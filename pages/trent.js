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

let x = [
  {
    name: "NP",

    children: [
      {
        name: "NP",
        children: [
          {
            name: "DET",
          },
          {
            name: "NN",
          },
        ],
      },
      {
        name: "VP",

        children: [
          {
            name: "VB",
          },
        ],
      },
    ],
  },
];

export default function OrgChartTree({ children }) {
  console.log(children);
  const orgChart = {
    name: "S",
    children: children,
  };

  const treeConfig = {
    nodeSize: { x: 150, y: 100 }, // Adjust node size as needed
    transitionDuration: 500, // Set transition duration in milliseconds
    linkColor: "blue", // Set the link color
    nodeSize: { x: 150, y: 100 }, // Adjust the node size as needed
    separation: { siblings: 1, nonSiblings: 2 },
    zoom: 0.6, // Adjust the zoom level as needed
    orientation: "vertical", // Set the tree orientation to "vertical"
    transitionDuration: 1000,
    rootNodeClassName: "node__root",
    branchNodeClassName: "node__branch",
    pathClassFunc: "node__branch",

    // styles={treeStyles}
  };
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div style={containerStyles}>
      <Tree data={orgChart} translate={{ x: 350, y: 50 }} {...treeConfig} />
    </div>
  );
}
