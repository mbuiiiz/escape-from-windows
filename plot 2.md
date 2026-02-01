# Plot for hackathon

## Ideas

- Student at SFU, abandoned lab
  - Student wakes up in a computer lab (ASB 9700) and the system shut down after a fail
      experiment

## Intro

- Found a usb
- plug it into an old desktop
- find hints surrounding for password (or most used password in 2000)
- enters the desktop with content in usb
- browse around and find evidence

- might be on a call with someone
- solve the puzzle in order to escape from the room/maze

## Possible hints

- File metadata
  - Signature
  - Date created
- Restore points
  - XP silently creates restore points of previous versions
  - use to find out which files have been modified
- Recycle bin
  - Forgotten files in the bin
- Internet explorer
  - check browsing history
- Systems clock mod
  - change date and time to the date of incident
- Pop ups window
  - Show error or hints
- Notepad
  - as sticky notes, might store to-do list of that day
  - possible passwords
  - personal notes
- Unsent emails
  - Draft yahoo mail
  - hints within sender and receiver
  - attachments
- Writing missing script/code (app: notepad++)
  - part of script containing syntax errors/missing lines
  - a file with bash syntax player could use to code
- Terminal making (for executing usb code)
  - code in usb might require a terminal to run

## Endings

- HE - Escaped successfully
- SE - Trapped

## Game Structure/Core Game Loop

1. Physical room:
    - pick up usb (encrypted)
    - plug usb to computer
    - explore computer, find hints to unlock usb
    - player must crack the usb (script/code) or recover password
    - time limits/attempt limits
    - escape if succeed

2. OS (simulation):
    - Desktop
    - My Computer
    - USB Drive (E:)
    - Recycle Bin
    - Internet Explorer
    - Notepad
    - Notepad++ (Coding IDE)
    - System Popups
    - Restore Points

3. USB Contents:

    - ```bash
        E:\
         |- unlock.exe
         |- README.txt
        ```

    - When clicked:
        - Access denied
    - Password:
        - attempts limit: 10
        - after 10 attemps: popup hint: "Manual access blocked. Use a different method."
        - length: numbers/digits
        - following most used password in 2000s
        - password consist of their birthday
    - Script/code:
        - ~20 lines of code, missing 5 lines
        - takes time to run (UI: loading cursor)
        - if wrong code: takes forever to run, user has to figure out and exit themselves

4. Hints/Puzzles:

    1. File Metadata Correlation
        - Several documents on the desktop and in `My Documents`
        - Right-click -> `Properties`
        - Multiple files containing same Author, Create date, Time
        - -> Leads to meaningful dates
        - -> **Password fragment 1**
    2. Restore Point File Diff
        - Player opens System Restore
        - Browse through multiple versions before USB encryption
        - Found a few notes:
            - Old version (`notes.txt`):

            - ```bash
                Password reminder: Nickname + #### + special char
                ```

            - Current version (`notes.txt`)

            - ```bash
                Password reminder: (removed)
                ```

        - -> **Password Structure Revealed**
    3. Recycle Bin:
        - Multiple deleted txt files
        - One of them: (`untitled(5).txt`):

            - ```bash
                I have to stop using my old username everywhere
                ```

        - Logic: owner reuses usernames as passwords; old username is key
        - `decrypt.js`:

            - ```js
                function xorDecrypt(data, key) {
                // missing loop
                // missing return
                }
                ```

        - -> **Password fragment 2**
    4. Internet Explorer History
        - History:
            - strong password in 200X
            - is ! better than ?
            - stack overflow codes
            - ****hub.com
            - Minimum password length
            - How to encrypt a usb
            - Is it easy to crack an encrypted usb?
        - -> **Password fragment 3**
        - -> Shows how the usb was encrypted and how to decrypt
    5. Notepad Personal Habit Note
        - File: `todo.txt`
        - Where files are saved (important ones)
        - Hints: "In case system malfunctions check ... in ..."
        - `syntax_help.txt`: some random code strutures
    6. Voice recording (`.wav`) file
        - maybe morsecode?
    7. Image
        - family photo?
        - date on the photo?

5. Virus/Malware
        - some emails will have some malicious malware/virus
        - history of explorer
        - some files may contain malware virus

## App structure

### Top-Level View

```bash
Desktop/
├── My Computer
├── Recycle Bin
├── Internet Explorer
├── Notepad
├── Notepad++
├── ReadMe_FIRST.txt
├── Work
├── Personal
├── Temp
└── system_warning.lnk
```

### My Computer

```bash
My Computer/
├── Local Disk (C:)
├── USB Drive (E:)
└── Control Panel
```

### USB Drive (E:)

```bash
USB Drive (E:)/
├── unlock.exe        🔒 (LOCKED)
├── README.txt        🔒 (ENCRYPTED)
├── security.dat
└── backup/
    └── unlock_old.exe   (corrupted)
```

### Local Disk (C:)

```bash
Owner/
├── Desktop/
├── My Documents/
    Notes/
        ├── todo.txt                 ⭐
        ├── notes.txt                ⭐
        ├── syntax_help.txt          ⭐
        ├── passwords_draft.txt      🗑️ (misleading)
        ├── random_thoughts.txt      ❌
        └── shopping_list.txt        ❌
    ├── Projects/
        ├── usb_decrypt/
        │   ├── decrypt.js           ⭐ (BROKEN)
        │   ├── README.md            ⭐
        │   └── test_data.txt
        ├── old_scripts/
        │   ├── decrypt_backup.js    🗑️ (PARTIAL)
        │   └── notes_old.txt        ⭐
        └── experiments/
            ├── temp.js              ❌
            └── hello_world.js       ❌
    ├── Images/
        ├── desktop_bg.bmp           ⭐
        ├── family_photo.jpg         ⭐
        ├── cat_picture.png          ❌
        └── random_wallpaper.bmp     ❌
    ├── Audio/
        ├── recording.wav            ⭐
        ├── static.wav               ❌
        └── test_sound.wav           ❌
        └── Old
├── Downloads/
    └── Some random files
└── Favorites/
    └── Some random files
└── Recycle Bin/
    ├── password_old.txt         ⭐
    ├── decrypt_backup.js        ⭐
    ├── note_draft.txt           ⭐
    ├── temp.txt                 ❌
    └── test123.txt              ❌
```

## Optional features (implement last)

- AI API (Gemini) to generate new stories
  - such as different owner personalities, note-writting styles, fake emails/logs, varied popup
      messages, unique narrative backstory each run
- Displaying stats
  - Time taken, puzzles solving time
  - Progress
