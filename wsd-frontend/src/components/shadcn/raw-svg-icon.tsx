export function RawSVGIcon({ svg }: { svg: string }) {
  return (
    <div className="w-4 h-4" dangerouslySetInnerHTML={{ __html: svg }} />
  )
}
