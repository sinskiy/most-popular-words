import { useSearchParams } from "next/navigation";

export default function useModifiedSearchParams(key: string, value: string) {
  const searchParams = useSearchParams();
  const localParams = new URLSearchParams(searchParams);
  localParams.set(key, value);
  return localParams;
}
