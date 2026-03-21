### **Project Spec: Emoji Prompt Injector**

**1. Overview**

A minimalist, single-page web application designed for AI developers and prompt engineers. The tool provides a quick and intuitive interface to prepend a standard Unicode emoji to a text-based prompt, creating a structured string ready for use in various AI development contexts.

**2. Target Audience**

AI developers, researchers, and prompt engineers who need to quickly format prompts or data with an emoji prefix for model training, testing, or interaction.

**3. Functional Requirements**

**3.1. Emoji Selection**

- **FR-101:** The application must display a comprehensive list of standard Unicode emojis.
- **FR-102:** Emojis shall be presented in a visually accessible, scrollable grid or list.
- **FR-103:** The user must be able to select a single emoji by clicking on it.
- **FR-104:** The currently selected emoji shall be clearly and visually highlighted.

**3.2. Prompt Input**

- **FR-201:** A dedicated text input area (e.g., `<textarea>`) must be available for the user to enter their prompt.
- **FR-202:** The input area should be resizable to accommodate multi-line prompts.
- **FR-203:** The input area should contain placeholder text when empty, such as "Enter your AI prompt here...".

**3.3. Prompt Injection & Output**

- **FR-301:** The application shall dynamically generate an output string as the user selects an emoji or types a prompt.
- **FR-302:** The output string must be displayed in a read-only text area.
- **FR-303:** **Output Format:** The generated output will be a single string in the format: `selected_emoji: user_prompt`
  - _Example:_ If the user selects "✅" and enters "Task completed successfully", the output will be `"✅: Task completed successfully"`.
  - A single space character must follow the colon.
- **FR-304:** A "Copy" button must be placed adjacent to the output display area.
- **FR-305:** Clicking the "Copy" button must copy the entire generated output string to the user's clipboard.
- **FR-306:** The UI should provide clear visual feedback when the copy action is successful (e.g., the button text temporarily changes from "Copy" to "Copied!").

**4. Non-Functional Requirements**

**4.1. User Interface & Experience (UI/UX)**

- **NFR-101:** The application must be a single-page application (SPA). No navigation or multiple pages are required.
- **NFR-102:** The design shall be clean, minimalist, and intuitive, prioritizing function and speed over complex visuals.
- **NFR-103:** The layout must be responsive and fully functional on modern desktop and mobile web browsers.
- **NFR-104:** No user accounts, login, or data persistence is required. The application state is ephemeral.

**4.2. Performance**

- **NFR-201:** Initial application load time should be under 2 seconds on a standard broadband connection.
- **NFR-202:** Emoji selection and output string generation must feel instantaneous, with no discernible lag to the user.

**4.3. Data**

- **NFR-301:** The list of emojis shall be statically included within the application. No external API calls should be necessary to fetch the emoji list at runtime.

**5. Technical Stack**

- **Type:** Frontend-only Single Page Application (SPA).
- **Build Tool:** Vite
- **UI Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

**6. Code Quality and Formatting**

- **Linter/Formatter:** ESLint and Prettier must be configured.
- **Style Guide:** All TypeScript/React code must adhere to the Airbnb JavaScript Style Guide, adapted for TypeScript where applicable. This will be enforced through ESLint configuration.
- **Code Hygiene:** Code should be well-documented where complex logic exists. Components should be modular and follow the single-responsibility principle.

**7. Future Enhancements (Out of Scope for V1)**

- **Emoji Search:** An input field to filter the emoji list by name or keyword (e.g., typing "rocket" shows "🚀").
- **Emoji Categories:** Filtering emojis by standard categories (e.g., "Smileys & People", "Animals & Nature").
- **History:** A list of recently generated/copied prompts.
- **Customizable Output Format:** User-definable templates for the output string (e.g., `[EMOJI] - {PROMPT}`).
- **API Access:** A simple API endpoint for programmatic prompt generation.
