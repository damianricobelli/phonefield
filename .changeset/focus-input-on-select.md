---
"phonefield": minor
---

Picking a country moves focus to the phone input, so the user can type the number right away.

- **Focus follows the pick.** After a country is chosen from the list, with the pointer or Enter, focus moves to the input with the caret after the digits already typed. Closing the picker without picking (Escape, clicking outside) still returns focus to the trigger, and typing on the closed trigger keeps focus there. Works the same in the Base UI, Radix, and React Aria adapters, and Root's `onBlur` does not run in between.
- **`focusInputOnSelect` on `Country`.** Pass `focusInputOnSelect={false}` to keep the previous behavior and always return focus to the trigger. In Base UI, `finalFocus` on `CountryPopup` still overrides it; in Radix, so does calling `event.preventDefault()` in `CountryContent`'s `onCloseAutoFocus`.
- **`focusInput()` from `usePhoneField()`.** Focuses the input with the caret at the end and returns `false` when no enabled input is mounted, so a custom picker such as a drawer can do the same when it closes after a pick.
