/**
 * Map MongoDB documents to API shape expected by the React app (id string, not _id).
 * @param {import('mongodb').WithId<import('mongodb').Document>|null} doc
 */
export function toClientDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export function toClientDocs(docs) {
  return docs.map((d) => toClientDoc(d));
}
