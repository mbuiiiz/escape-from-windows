# Puzzles core

**Password:**

- consists of 5 blocks:
- `<block1><block2><block5><block4><block5>`
- e.g: `james_hoang_09_1999_!!`
- player wont see this structure, there will be hints
  - structure hints
    - what the structure looks like
    - useful hints to look for
  - block hints
    - block size e.g. `1st block has 5 char`
    - block type e.g. `2nd block has numbers`
    - block relevant info e.g `3rd block is about personality`
    - block containing e.g `4th block starts with b`
    - block possible hint e.g `5th block hint could be found in ...`

## Hints

### My Computer

#### C:/

##### My Documents/

- `/Notes`
  - `todo.txt`
    - owner currently working on decrypt.js
    - mentions timestamp (which version of the code works best)
    - e.g:

    - ```txt
      - clean up logs (too many repeats)
      - stop testing at the same time every night
      - fix decrypt script before I forget again
      - remove old drafts (they’re misleading)
        ```

  - `notes.txt`
    - check for dates

    - ```txt
      I hate how systems remember better than people.
      Dates don’t lie.
      Names do.
      ```

  - `syntax_help.txt`
    - Password blocks are conceptual, not literal
    - Ending symbol is emotional

    - ```txt
      JS reminders:
      - strings are just patterns
      - numbers don’t have to mean dates
      - symbols make things feel finished
      ```

  - `passwords_draft.txt`
    - wrong attemps
    - reveal structures

    - ```txt
      admin_admin_01_2005_!
      owner_home_07_2005_!!
      test_test_12_1999_?
      ```

  - `random_thoughts.txt`
    - repetition

    - ```txt
      Everyone thinks I’m consistent.
      I’m not.
      I just repeat what feels safe.
      ```

  - `shopping_list.txt`
    - misleading stuffs

    - ```txt
      Coffee
      Headphones
      External USB
      Notebook (again)
      ```

- `/Projects`
  - `usb_cracker/`
    - `decrypt.js`
      - see end of file
    - `README.md`
      - possible functions order
      - see end of file

  - `old_scripts/`
    - `decrypt_backup.js` - part of working code
    - `old_notes.txt` - which functions worked, which didnt

  - `experiments/`
    - all random files for misleading
    - `temp.js`
    - `hello_world.js`

- `Images/`
  - `desktop.jpg`
    - check properties:
      - author
      - date created
  - all other images contain the same metadata

- `Audio/`
  - hints lead to check images folder

##### Downloads

- Some random files

##### Favourites

- Some random files

##### Recycle Bin/

- *Hidden truth via discarded info*
- `decrypt_old.js`

  - ```js
    // older version
    // cleaning and decoding logic still works
    // key logic was changed later

    function cleanData(raw) {
      return raw.replace(/-----.*-----/g, "").trim();
    }

    function decodePayload(p) {
      return atob(p);
    }
    ```

- `note_draft.txt`

  - ```txt
    I deleted this because it sounded dramatic.
    But I really did mean to slow things down.

    If someone gets in,
    I want them to understand why it wasn’t easy.
    ```

- `password_old.txt`

  - ```txt
    Old format was predictable.
    Five pieces.
    Separated the same way every time.
    ```

## Decrypt.js

```js
/**
 * decrypt.js
 *
 * Purpose:
 *  - Read protected USB data
 *  - Derive a key
 *  - Decrypt contents
 *  - Produce unlock credentials
 *
 * Status:
 *  - Incomplete
 *  - Some logic removed or reordered
 *  - See README.md
 */

// Simulated USB data (normally read from E:\security.dat)
const SECURITY_DAT = `
-----BEGIN-----
b2JmdXNjYXRlZDphX2tleV9pbnNpZGVfcmVhbGl0eQ==
-----END-----
`;

// System metadata collected elsewhere
const META = {
  installDate: "2005-11-10",
  incidentDate: "2005-11-14",
  authorTag: "C.H.",
  habit: 7,
  ending: "!"
};

/**
 * Read raw USB data
 */
function readData() {
  return SECURITY_DAT;
}

/**
 * Strip headers and comments
 */
function cleanData(raw) {
  const lines = raw
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.includes("BEGIN") && !l.includes("END"));

  const payload = lines[0].split("#")[0].trim();

  // TODO: return cleaned payload
}

/**
 * Build a key from system metadata
 */
function buildKey(meta) {
  const tag = meta.authorTag.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const habit = /* TODO */ ;
  const year = meta.incidentDate.slice(0, 4);

  const key = `${tag}-${habit}-${year}`;

  // TODO: return key
}

/**
 * Decode payload to readable text
 */
function decodePayload(payload) {
  // TODO: decode base64-like payload
}

/**
 * Apply reversible transform
 */
function decryptText(text, key) {
  let out = "";

  for (let i = 0; i < text.length; i++) {
    const t = text.charCodeAt(i);
    const k = key.charCodeAt(i % key.length);

    // TODO: reverse transform
    const c = /* missing */;

    out += String.fromCharCode(c);
  }

  return out;
}

/**
 * Assemble final password
 */
function assemblePassword(decrypted, meta) {
  const parts = decrypted
    .split(/[|:_]/g)
    .map(p => p.trim())
    .filter(Boolean);

  const a = (parts[0] || "").toLowerCase();
  const b = (parts[1] || "").toLowerCase();
  const c = parts[2] || "00";
  const d = parts[3] || meta.incidentDate.slice(0, 4);
  const e = meta.ending;

  // TODO: return 5-block password joined by "_"
}

/**
 * Final step
 */
function unlock(password) {
  console.log("Generated password:", password);
}

/**
 * Entry point
 * Order may be incorrect — see README.md
 */
function main() {
  const raw = readData();
  const key = buildKey(META);
  const cleaned = cleanData(raw);

  // TODO: decode before decrypting
  const decoded = /* missing */;

  const decrypted = decryptText(decoded, key);
  const password = assemblePassword(decrypted, META);

  unlock(password);
}

main();

```

## README.md

```md
This script used to work.

I remember fixing it in stages, not all at once.

What mattered was doing things in the right order:
- inspect what you have
- remove what doesn’t belong
- rebuild what was personal
- turn unreadable into readable
- reverse the protection
- put everything back together

If you jump ahead, it won’t make sense.
```

## Decrypt_backup.js

```js
// Older version
// Not all of this is correct anymore

function cleanData(raw) {
  return raw.replace(/-----.*-----/g, "").trim();
}

function buildKey(meta) {
  return meta.authorTag.toLowerCase();
}

// decrypt logic was changed later
```

## old_notes.txt

```txt
The cleaning step was fine.
The decoding step didn’t change.
The key logic is what broke everything.
I made it less obvious on purpose.
```
