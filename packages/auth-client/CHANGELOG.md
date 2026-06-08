# @iot-platform/auth-client

## 0.3.1

### Patch Changes

- docs: update READMEs to reflect Organization → Account rename
- Updated dependencies
  - @iot-platform-saf/shared-types@0.3.1

## 0.3.0

### Minor Changes

- Replace Organization with Account on the platform User type

  **Breaking change:** `Organization` interface and `User.organization` field are removed.

  - `Account { id: string; name: string; displayName: string }` is now the platform identity type
  - `User.account: Account` replaces `User.organization: Organization`
  - `auth-client` JWT decoder now reads the `account` claim (tokens must be re-issued)

  **Migration:** Replace all `user.organization.name` → `user.account.displayName` and `user.organization.id` → `user.account.id`.

### Patch Changes

- Updated dependencies
  - @iot-platform-saf/shared-types@0.3.0

## 0.2.1

### Patch Changes

- Add comprehensive README with step-by-step setup guide, full API reference, and architecture diagram.
- Updated dependencies
  - @iot-platform-saf/shared-types@0.2.1

## 0.2.0

### Minor Changes

- Initial release — shared types, auth client, and shell UI components

### Patch Changes

- Updated dependencies
  - @iot-platform/shared-types@0.2.0
