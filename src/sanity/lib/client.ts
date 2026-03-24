import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

const isConfigured = projectId && projectId !== "PLACEHOLDER";

export const client = isConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, string>
): Promise<T | null> {
  if (!client) return null;
  try {
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch {
    console.warn("Sanity fetch failed — is the project configured?");
    return null;
  }
}
