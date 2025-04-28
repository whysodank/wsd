import { cn } from '@/lib/utils'

export interface MentionItem {
  id: string
  label: string
}

export interface MentionListProps {
  items: MentionItem[]
  command: (item: MentionItem) => void
  loading: boolean
  selectedIndex: number
}

export const MentionList = ({ items, loading, command, selectedIndex }: MentionListProps) => {
  const selectItem = (index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }

  return (
    <div className="rounded-md border shadow-md overflow-hidden py-1 bg-background">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={item.id}
            className={cn(
              'w-full text-left px-4 py-2 text-sm hover:bg-muted focus:bg-muted',
              index === selectedIndex && 'bg-muted'
            )}
            onClick={() => selectItem(index)}
            type="button"
          >
            {item.label}
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-muted-foreground">{loading ? 'Searching' : 'No Results'}</div>
      )}
    </div>
  )
}
