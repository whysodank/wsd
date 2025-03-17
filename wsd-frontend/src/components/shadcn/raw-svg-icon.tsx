import {cn} from "@/lib/utils";

export function RawSVGIcon({svg, className}: { svg: string, className?: string }) {
  return (
    // TODO: we probably should use an html parser here so that we don't kill the front-end
    // in case we mess up some icon svg in the admin panel
    // html-react-parser && dompurify
    <div className={cn("w-5 h-5 [&>svg]:w-full [&>svg]:h-full", className)} dangerouslySetInnerHTML={{__html: svg}} />
  )
}
