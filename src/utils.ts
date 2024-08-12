export function TypedJSONParse<P = any>(jsonString: string): P | null {
  if (!jsonString) {
    return null;
  }
  return JSON.parse(jsonString);
}
