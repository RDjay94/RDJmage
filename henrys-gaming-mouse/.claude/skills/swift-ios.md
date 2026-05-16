---
name: swift-ios
description: Conventions and guardrails for Henry's Gaming Mouse — a SwiftUI iOS app that pairs with a SwiftUI macOS host over a custom BLE GATT service. TRIGGER when the user works on any Swift file under iOS/HenrysGamingMouse, macOS/HenrysGamingMouseHost, or Shared; or asks to build, run, lint, archive, ship, or submit the app; or modifies BLE protocol, CoreMotion, CGEvent code; or asks for Xcode/TestFlight/App Store guidance.
---

# Henry's Gaming Mouse — Swift conventions

You are working on a two-target project: a SwiftUI iOS app that advertises a custom Bluetooth Low Energy GATT service, and a SwiftUI macOS menu-bar host that connects to it and synthesizes cursor events with `CGEvent`. Both apps share `Shared/BLEProtocol.swift`.

## Architecture rules

- **Shared/BLEProtocol.swift is canonical.** Every UUID, packet type, and packet field lives here. Never duplicate the UUID strings into the apps. If a new event type is added, extend `HenrysGamingMouseBLE.EventType`, bump no version (we'll worry about versioning at v2), and update both the iOS sender and the macOS `CursorController.handle`.
- **Packets stay fixed at 8 bytes, little-endian.** Don't switch to JSON or variable-length payloads — BLE characteristic writes are tiny and frequency-sensitive. If you need more fields, repurpose the reserved bytes [6..7] before changing the size.
- **iOS is always the BLE peripheral, Mac is always the central.** Do not flip the roles. iOS-as-peripheral is the only configuration that lets the iPhone advertise in the background with the `bluetooth-peripheral` UIBackgroundMode.
- **No backend, no analytics SDKs.** The product is local-only by design. Don't pull in Firebase, Mixpanel, etc., even for crash reporting — use Apple's built-in MetricKit if needed.

## iOS app conventions

- SwiftUI only; no UIKit unless wrapping a `UIPanGestureRecognizer` for true multi-touch (the trackpad's two-finger scroll path is the one known case).
- Deployment target iOS 16. Use `MenuBarExtra`, `@Observable` macros from iOS 17 only behind `#available` guards.
- CoreBluetooth callbacks land on a background queue. **Always hop to `DispatchQueue.main` before mutating `@Published` state.**
- CoreMotion: 60 Hz max (`deviceMotionUpdateInterval = 1.0 / 60.0`). Anything higher wastes battery without improving feel.
- Privacy strings in `Info.plist` are required and user-readable. If you change what the app does with Bluetooth or motion, update the string — App Review reads these.

## macOS host conventions

- The host runs as a menu-bar-only app (`LSUIElement = true`). Never add a Dock icon or a main window.
- **App Sandbox must stay OFF.** Sandboxed apps cannot post `CGEvent`s to the system event tap; the app silently does nothing if you turn it on.
- All cursor moves go through `CursorController.move`. When a button is held (`leftDown` / `rightDown`), use `.leftMouseDragged` / `.rightMouseDragged` event types instead of `.mouseMoved`, otherwise drag-select breaks.
- Scroll deltas use `CGScrollEventUnit.line` with negated dy (CGEvent convention is opposite of touch convention).

## Tasks you should know how to do

### Add a new input event

1. Add a case to `HenrysGamingMouseBLE.EventType` in `Shared/BLEProtocol.swift`.
2. On iOS, find the gesture/handler that should emit it (`TrackpadView.swift` or `ContentView.swift`) and call `peripheral.send(HenrysGamingMouseBLE.encode(type: .yourCase, ...))`.
3. On macOS, add a case to `CursorController.handle` that maps it to a `CGEvent`.
4. Test on a real iPhone (the simulator cannot advertise BLE).

### Tune feel

- Trackpad pointer speed: `moveScale` in `TrackpadView.swift`. Bump in 0.2 increments.
- Tilt sensitivity: `sensitivity` in `MotionManager.swift`. Default 18.0.
- Scroll: `scrollScale` in `TrackpadView.swift`.

### Build & test

- iOS: target a physical device. CoreBluetooth peripheral advertising is a no-op in the simulator.
- macOS host: after every fresh build, re-grant Accessibility (System Settings → Privacy & Security → Accessibility). The grant is per-binary-hash, so a new debug build needs re-approval.

### Pre-submission checklist (App Store / TestFlight)

Before suggesting `archive`:
- Bump `CFBundleVersion` in both Info.plists.
- Confirm privacy strings still match the actual behavior.
- Verify there are no `print` statements emitting PII (peripheral identifiers, screen coordinates with user names, etc.).
- Generate a privacy manifest (`PrivacyInfo.xcprivacy`) listing CoreMotion and Bluetooth usage if not already present.
- The Mac app does **not** go to the Mac App Store (sandboxing requirement). Build a notarized Developer ID `.dmg` instead and host the download from a website linked in the iOS app's App Store description.

## What not to do

- Don't suggest using the standard HID GATT service (UUID `0x1812`) — Apple reserves it; iOS will reject your advertisement silently.
- Don't add Carthage, CocoaPods, or SwiftPM dependencies for things Foundation/CoreBluetooth/CoreMotion already do. The whole project is intentionally dependency-free.
- Don't refactor the BLE layer to use async/await streams unless the user asks — the delegate pattern matches Apple's CoreBluetooth examples and is easier to debug.
- Don't add tests for the BLE handshake in CI — it requires real hardware. Add unit tests for `BLEProtocol.encode/decode` round-trips only.
