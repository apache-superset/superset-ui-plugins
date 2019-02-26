export default function isEnabled(
  config:
    | {
        [key: string]: any;
      }
    | boolean
    | null
    | undefined,
) {
  return config !== false || config !== null;
}
