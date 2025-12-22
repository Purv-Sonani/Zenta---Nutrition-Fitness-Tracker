export function Badge({ text }: { text: string }) {
  return <span className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600">{text}</span>;
}
