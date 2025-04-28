def get_mentions(tiptap_content):
    """
    Extract mentions from TipTap JSON (ProseMirror format).
    Only returns the mentions' ids.
    """
    mentions = []

    def traverse_content(content):
        for node in content:
            if node.get("type") == "mention" and "attrs" in node and "id" in node["attrs"]:
                mentions.append(node["attrs"]["id"])
            if "content" in node:
                traverse_content(node["content"])

    # Start traversal from the top-level 'doc' content
    if "content" in tiptap_content:
        traverse_content(tiptap_content["content"])

    return mentions
