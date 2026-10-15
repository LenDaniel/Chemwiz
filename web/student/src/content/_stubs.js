// Stub factory for the 21 topics not yet ported. Each returns an object of the
// same shape as a real content module so the app can render "built but pending"
// state without special-casing.
// When we build a topic out, we replace its entry in content/index.js with
// the real module file.

export function makeStub(topicId) {
  return null; // null means "no content yet" — TopicView handles this gracefully
}
