export const validTags = ["required", "default", "type"] as const;
export type ValidTag = typeof validTags[number]; // 'required' | 'default' | 'type'

export const validTypes = ["boolean", "string", "number", "json"] as const;
export type ValidType = typeof validTypes[number];

export const tagOrderExecute = ["required", "default", "type"] as const;
export type TagOrderExecute = typeof tagOrderExecute[number];
