import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { readJSON, writeJSON } from "../lib/storage";

/** Like useState, but the value survives page reloads. `T` is inferred from `initial`. */
export function useLocalStorage<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readJSON(key, initial, isValid));

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
