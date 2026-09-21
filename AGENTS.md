# Project implementation guidelines

These rules apply throughout this repository, including all redesign and maintenance work.

1. Always prioritize existing Vuetify components when they can satisfy the requirement. Create custom components only when Vuetify does not provide a suitable solution or when preserving an approved design requires a documented exception.
2. Keep pages and presentation components focused on rendering and interaction. Move reusable business logic, API orchestration, configuration, mappings, and transformations into composables, constants, or utility files whenever practical.
3. For styling, prioritize Vuetify utility classes and existing Vuetify theme tokens. Avoid inline style bindings when a utility class, component prop, theme token, or reusable CSS class can express the same behavior.
4. Do not implement responsive design with inline styles, viewport-dependent style bindings, or `v-show` driven by viewport state. Use Vuetify responsive utilities, responsive component props, or stylesheet media queries instead.
5. For interface and decorative icons, first use a suitable Material Design icon already available in the project. If no existing Material icon satisfies the approved design, add the custom icon to the `gamatrain` icon font and render it through the project's icon system. Do not use image files or inline SVGs for interface or decorative icons unless the image or SVG is an explicitly documented intentional exception. Genuine content images, such as avatars, board logos, and resource covers, remain images.
6. Use existing project color tokens for all interface colors. If an exact color token does not exist, first choose the closest suitable existing token. Add a new named project color token only when preserving an approved design requires the exact color, and document that exception. Do not scatter hardcoded color values through components.

Before implementing or approving a UI change, check it against these rules and report any necessary exception and its design impact.
