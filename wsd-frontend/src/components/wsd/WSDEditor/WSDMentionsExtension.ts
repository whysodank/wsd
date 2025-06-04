import _ from 'lodash'

import { getWSDAPI } from '@/lib/serverHooks'

import { MentionItem, MentionList, MentionListProps } from './WSDMentions'
import Mention from '@tiptap/extension-mention'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { ReactRenderer } from '@tiptap/react'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance as TippyInstance } from 'tippy.js'

export const WSDMention = Mention.configure({
  HTMLAttributes: { class: 'mention' },
  renderHTML({ node }: { node: ProseMirrorNode }) {
    return [
      'a',
      {
        href: `/users/${node.attrs.id}`,
        class: 'mention-link',
        target: '_blank',
      },
      `@${node.attrs.label}`,
    ]
  },
  suggestion: {
    char: '@',
    items: (): MentionItem[] => {
      return []
    },
    render: () => {
      let component: ReactRenderer<MentionListProps>
      let popup: TippyInstance[] = []
      let selectedIndex = 0
      const wsd = getWSDAPI()

      const fetchUsersDebounced = _.debounce(
        async (searchTerm: string, updateItems: (items: MentionItem[]) => void) => {
          try {
            const { data } = await wsd.users({ username__icontains: searchTerm, page_size: 5 })
            const items = _.map(data?.results || [], (user) => ({ id: user.username, label: user.username }))
            updateItems(items)
          } catch (error) {
            console.error('Error fetching users:', error)
          }
        },
        300
      )

      const setSelectedIndex = (index: number) => {
        selectedIndex = index
        component.updateProps({ selectedIndex })
      }

      return {
        onStart: (props: SuggestionProps) => {
          component = new ReactRenderer(MentionList, {
            props: {
              items: [],
              loading: true,
              selectedIndex: 0,
              command: props.command,
            },
            editor: props.editor,
          }) as ReactRenderer<MentionListProps>

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })

          component.updateProps({
            loading: true,
            selectedIndex,
            command: props.command,
            items: [],
          })

          fetchUsersDebounced(props.query, (items: MentionItem[]) => {
            component.updateProps({ items, loading: false })
          })
        },
        onUpdate(props: SuggestionProps) {
          component.updateProps({
            loading: true,
            selectedIndex,
            command: props.command,
            items: [],
          })

          popup[0].setProps({ getReferenceClientRect: props.clientRect as () => DOMRect })

          fetchUsersDebounced(props.query, (items: MentionItem[]) => {
            component.updateProps({ items, loading: false })
          })
        },
        onKeyDown(props: SuggestionKeyDownProps): boolean {
          const { items = [], command } = component.props as MentionListProps

          if (props.event.key === 'ArrowUp') {
            if (items.length) {
              setSelectedIndex((selectedIndex + items.length - 1) % items.length)
              return true
            }
          }

          if (props.event.key === 'ArrowDown') {
            if (items.length) {
              setSelectedIndex((selectedIndex + 1) % items.length)
              return true
            }
          }

          if (props.event.key === 'Enter') {
            if (items.length && items[selectedIndex]) {
              command(items[selectedIndex])
              return true
            }
          }

          if (props.event.key === 'Escape') {
            popup[0].hide()
            return true
          }

          return false
        },
        onExit() {
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  },
})

export const WSDMentionSSR = Mention.configure({
  HTMLAttributes: { class: 'mention' },
  renderHTML({ node }: { node: ProseMirrorNode }) {
    return [
      'a',
      {
        href: `/users/${node.attrs.id}`,
        class: 'mention-link',
        target: '_blank',
      },
      `@${node.attrs.label}`,
    ]
  },
})
