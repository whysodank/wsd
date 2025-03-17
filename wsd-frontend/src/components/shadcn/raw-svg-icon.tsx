import {cn} from "@/lib/utils";

export function RawSVGIcon({svg, className}: { svg: string, className?: string }) {
  return (
    <div className={cn("w-5 h-5 [&>svg]:w-full [&>svg]:h-full", className)} dangerouslySetInnerHTML={{__html: svg}} />
  )
}
