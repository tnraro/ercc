// https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute
// The id attribute value must be unique amongst all the IDs
// in the element's tree and must contain at least one character.
// The value must not contain any ASCII whitespace.
// https://www.w3.org/TR/CSS21/syndata.html#characters
// In CSS, identifiers (including element names, classes, and IDs
// in selectors) can contain only the characters [a-zA-Z0-9] and
// ISO 10646 characters U+00A0 and higher, plus the hyphen (-) and
// the underscore (_); they cannot start with a digit, two hyphens,
// or a hyphen followed by a digit.
const enum Consts {
  Table = "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-",
  Range = 3642132267007, // 0 <= x < 53 * 64^6, x < 2^53, and x \in N
}
const ids = new Set<string>();
export function createUniqueId(): string {
  const id = toString(Math.floor(Math.random() * Consts.Range));
  if (ids.has(id)) {
    return createUniqueId();
  }
  ids.add(id);
  return id;
}
export function disposeId(id: string) {
  return ids.delete(id);
}
export function generateUniqueIds<T extends string>(
  ...keys: T[]
): [Record<T, string>, () => void] {
  const idset = keys.reduce(
    (idset, key) => {
      idset[key] = createUniqueId();
      return idset;
    },
    {} as Record<T, string>,
  );
  return [
    idset,
    () => {
      keys.forEach((key) => disposeId(idset[key]));
    },
  ];
}

function toString(n: number) {
  const s = ["", "", "", "", "", "", ""]; // too avoid HOLEY_ELEMENTS
  for (let i = 0; i < 7; i++) {
    s[6 - i] = Consts.Table[n % 64];
    n = Math.floor(n / 64);
  }
  return s.join("");
}
