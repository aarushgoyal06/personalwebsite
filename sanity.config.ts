import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { projectId, dataset } from "./src/sanity/env";

export default defineConfig({
  name: "personalwebsite",
  title: "Personal Website",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  basePath: "/studio",
});
